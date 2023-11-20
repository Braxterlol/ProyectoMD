const db = require('../configs/db.config');

class Pedido {
    constructor({ PedidoID, fecha, estado, createdAt, updatedAt }) {
        this.PedidoID = PedidoID;
        this.fecha = fecha;
        this.estado = estado;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT PedidoID, fecha, estado, created_at, updated_at FROM pedidos";

        if (sort && order) {
            query += ` ORDER BY ${sort} ${order}`;
        }

        if (offset >= 0 && limit) {
            query += ` LIMIT ${offset}, ${limit}`;
        }

        const [rows] = await connection.query(query);
        connection.end();

        return rows;
    }

    static async getById(PedidoID) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT PedidoID, fecha, estado, created_at AS createdAt, updated_at AS updatedAt FROM pedidos WHERE PedidoID = ?", [PedidoID]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Pedido({ PedidoID: row.PedidoID, fecha: row.fecha, estado: row.estado, createdAt: row.createdAt, updatedAt: row.updatedAt });
        }

        return null;
    }

    static async deleteFisicoById(PedidoID) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM pedidos WHERE PedidoID = ?", [PedidoID]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se eliminó el pedido");
        }

        return;
    }

    static async updateById(PedidoID, { fecha, estado }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE pedidos SET fecha = ?, estado = ?, updated_at = ? WHERE PedidoID = ?", [fecha, estado, updatedAt, PedidoID]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó el pedido");
        }

        return;
    }

    async save() {
        const connection = await db.createConnection();

        const createdAt = new Date();
        const [result] = await connection.execute("INSERT INTO pedidos (fecha, estado, created_at) VALUES (?, ?, ?)", [this.fecha, this.estado, createdAt]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el pedido");
        }

        this.id = result.insertId;
        this.createdAt = createdAt;
        this.updatedAt = null;

        return
    }
}

module.exports = Pedido;
