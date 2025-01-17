const { Pool } = require("pg");

jest.mock("pg", () => {
    const mPool = {
        query: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});

const pool = new Pool();
const { getAllTransfers, createTransfer, updateTransfer, deleteTransfer } = require("./crud");

describe("Transfers CRUD Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch all transfers", async () => {
        const mockTransfers = [
            { id: 1, name: "Transfer1", amount: 100.00, created_at: "2025-01-01T00:00:00" },
        ];

        pool.query.mockResolvedValueOnce({ rows: mockTransfers });

        const transfers = await getAllTransfers();

        expect(transfers).toEqual(mockTransfers);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM transfers ORDER BY created_at DESC");
    });

    it("should create a new transfer", async () => {
        const newTransfer = {
            name: "Transfer2",
            amount: 200.00,
        };
        const createdTransfer = { id: 2, ...newTransfer, created_at: "2025-01-01T00:00:00" };

        pool.query.mockResolvedValueOnce({ rows: [createdTransfer] });

        const result = await createTransfer(newTransfer);

        expect(result).toEqual(createdTransfer);
        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO transfers (name, amount) VALUES ($1, $2) RETURNING *",
            [newTransfer.name, newTransfer.amount]
        );
    });

    it("should update a transfer", async () => {
        const transferId = 1;
        const updatedFields = { name: "Updated Transfer", amount: 250.00 };
        const updatedTransfer = { id: transferId, ...updatedFields, created_at: "2025-01-01T00:00:00" };

        pool.query.mockResolvedValueOnce({ rows: [updatedTransfer] });

        const result = await updateTransfer(transferId, updatedFields);

        expect(result).toEqual(updatedTransfer);
        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE transfers SET name = $1, amount = $2 WHERE id = $3 RETURNING *",
            [updatedFields.name, updatedFields.amount, transferId]
        );
    });

    it("should delete a transfer", async () => {
        const transferId = 1;

        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const result = await deleteTransfer(transferId);

        expect(result).toBe(true);
        expect(pool.query).toHaveBeenCalledWith("DELETE FROM transfers WHERE id = $1", [transferId]);
    });
});
