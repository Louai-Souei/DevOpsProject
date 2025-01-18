import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import "./MainComponent.css";

const MainComponent = () => {
  const [transfers, setTransfers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
  });
  const [editingTransfer, setEditingTransfer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all transfers
  const fetchTransfers = useCallback(async () => {
    try {
      const response = await axios.get("/api/transfers/all");
      setTransfers(response.data.data); // Make sure response structure matches this
    } catch (err) {
      console.error("Error fetching transfers:", err);
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTransfer) {
        // Update existing transfer
        await axios.put(`/api/transfers/${editingTransfer.id}`, formData);
      } else {
        // Create new transfer
        await axios.post("/api/transfers", formData);
      }

      setFormData({ name: "", amount: "" });
      setEditingTransfer(null);
      fetchTransfers();
      setIsModalOpen(false); // Close modal after submission
    } catch (err) {
      console.error("Error saving transfer:", err);
    }
  };

  // Handle edit button click
  const handleEdit = (transfer) => {
    setEditingTransfer(transfer);
    setFormData({
      name: transfer.name,
      amount: transfer.amount,
    });
    setIsModalOpen(true); // Open modal when editing
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/transfers/${id}`);
      fetchTransfers();
    } catch (err) {
      console.error("Error deleting transfer:", err);
    }
  };

  // Handle opening the modal for adding a new transfer
  const handleOpenModal = () => {
    setFormData({ name: "", amount: "" });
    setEditingTransfer(null);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  return (
      <div className="main-container">
        <h1 className="header">Transfers Management Test Feature</h1>

        {/* Transfer List */}
        <div className="transfer-list">
          <h2>All Transfers</h2>
          {transfers.map((transfer) => (
              <div key={transfer.id} className="transfer-item">
                <div className="transfer-info">
                  <strong>{transfer.name}</strong>
                  <p>{transfer.amount} USD</p>
                  <p>Created At: {new Date(transfer.created_at).toLocaleString()}</p>
                </div>
                <div className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(transfer)}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(transfer.id)}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
          ))}
          <button className="add-btn" onClick={handleOpenModal}>
            <FaPlusCircle /> Add Transfer
          </button>
        </div>

        {/* Modal/Dialog for Add/Edit Transfer */}
        {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{editingTransfer ? "Edit Transfer" : "Add New Transfer"}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <input
                      type="text"
                      name="name"
                      placeholder="Transfer Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                  />
                  <input
                      type="number"
                      name="amount"
                      placeholder="Amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                  />
                  <div className="modal-footer">
                    <button type="submit" className="submit-btn">
                      {editingTransfer ? "Update" : "Add"} Transfer
                    </button>
                    <button
                        type="button"
                        className="close-btn"
                        onClick={handleCloseModal}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default MainComponent;
