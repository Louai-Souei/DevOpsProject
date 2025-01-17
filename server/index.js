const pool = require("./keys");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getAllTransfers, createTransfer, updateTransfer, deleteTransfer } = require("./crud");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const createTransfersTable = async () => {
  const query = `
    DROP TABLE IF EXISTS transfers;
    CREATE TABLE transfers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Table 'transfers' supprimée et recréée avec succès.");
  } catch (err) {
    console.error("Erreur lors de la recréation de la table 'transfers':", err);
  }
};


createTransfersTable();


app.get("/", (req, res) => {
  res.send("Transfers CRUD API");
});

app.get("/transfers/all", async (req, res) => {
  try {
    const transfers = await getAllTransfers();
    res.status(200).json({ success: true, data: transfers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching transfers" });
  }
});

// Create a new transfer
app.post("/transfers", async (req, res) => {
  try {
    const transfer = await createTransfer(req.body);
    res.status(201).json({ success: true, data: transfer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating transfer" });
  }
});

// Update a transfer
app.put("/transfers/:id", async (req, res) => {
  const transferId = parseInt(req.params.id, 10);
  const updatedFields = req.body;

  if (isNaN(transferId)) {
    return res.status(400).json({ success: false, message: "Invalid transfer ID" });
  }

  try {
    const updatedTransfer = await updateTransfer(transferId, updatedFields);
    if (updatedTransfer) {
      res.status(200).json({ success: true, data: updatedTransfer });
    } else {
      res.status(404).json({ success: false, message: "Transfer not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating transfer" });
  }
});

// Delete a transfer
app.delete("/transfers/:id", async (req, res) => {
  const transferId = parseInt(req.params.id, 10);

  if (isNaN(transferId)) {
    return res.status(400).json({ success: false, message: "Invalid transfer ID" });
  }

  try {
    const deleted = await deleteTransfer(transferId);
    if (deleted) {
      res.status(200).json({ success: true, message: "Transfer deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Transfer not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting transfer" });
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
}
