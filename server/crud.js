const pool = require("./keys");

// Get all transfers
async function getAllTransfers() {
    const result = await pool.query("SELECT * FROM transfers");
    return result.rows;
}

// Create a new transfer
async function createTransfer(transfer) {
    const { name, amount } = transfer;
    const result = await pool.query(
        "INSERT INTO transfers (name, amount) VALUES ($1, $2) RETURNING *",
        [name, amount]
    );
    return result.rows[0];
}

// Update a transfer
async function updateTransfer(transferId, updatedFields) {
    const setClauses = Object.keys(updatedFields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");
    const values = Object.values(updatedFields);

    const result = await pool.query(
        `UPDATE transfers SET ${setClauses} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, transferId]
    );

    return result.rows[0];
}

// Delete a transfer
async function deleteTransfer(transferId) {
    const result = await pool.query("DELETE FROM transfers WHERE id = $1", [transferId]);
    return result.rowCount > 0;
}

module.exports = { getAllTransfers, createTransfer, updateTransfer, deleteTransfer };
