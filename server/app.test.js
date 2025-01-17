const { Pool } = require("pg");
const request = require("supertest");
const app = require("./index");

jest.mock("pg", () => {
    const mPool = {
        query: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});

const pool = new Pool();

const mockTransfers = [
    { id: 1, name: "Transfer 1", amount: 100.0, created_at: "2025-01-01T00:00:00Z" },
    { id: 2, name: "Transfer 2", amount: 200.0, created_at: "2025-01-02T00:00:00Z" },
];

describe("Integration Tests for Transfer API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return a welcome message", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("Transfers CRUD API");
    });

    it("should fetch all transfers", async () => {
        pool.query.mockResolvedValueOnce({ rows: mockTransfers });

        const res = await request(app).get("/transfers/all");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            data: mockTransfers,
        });
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM transfers");
    });

    it("should create a new transfer", async () => {
        const newTransfer = { name: "Transfer 3", amount: 300.0 };
        const createdTransfer = { id: 3, ...newTransfer, created_at: "2025-01-03T00:00:00Z" };

        pool.query.mockResolvedValueOnce({ rows: [createdTransfer] });

        const res = await request(app).post("/transfers").send(newTransfer);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            success: true,
            data: createdTransfer,
        });
        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO transfers (name, amount) VALUES ($1, $2) RETURNING *",
            [newTransfer.name, newTransfer.amount]
        );
    });

    it("should update an existing transfer", async () => {
        const transferId = 1;
        const updatedFields = { name: "Updated Transfer", amount: 150.0 };
        const updatedTransfer = { id: transferId, name: "Updated Transfer", amount: 150.0, created_at: "2025-01-01T00:00:00Z" };

        pool.query.mockResolvedValueOnce({ rows: [updatedTransfer] });

        const res = await request(app).put(`/transfers/${transferId}`).send(updatedFields);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            data: updatedTransfer,
        });
        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE transfers SET name = $1, amount = $2 WHERE id = $3 RETURNING *",
            [updatedFields.name, updatedFields.amount, transferId]
        );
    });

    it("should delete a transfer", async () => {
        const transferId = 1;

        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app).delete(`/transfers/${transferId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "Transfer deleted successfully",
        });
        expect(pool.query).toHaveBeenCalledWith("DELETE FROM transfers WHERE id = $1", [transferId]);
    });

    it("should return 404 when trying to delete a non-existent transfer", async () => {
        const transferId = 999;

        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).delete(`/transfers/${transferId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Transfer not found",
        });
        expect(pool.query).toHaveBeenCalledWith("DELETE FROM transfers WHERE id = $1", [transferId]);
    });
});
