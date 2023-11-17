const db = require('../configs/db.config');

class Pedido {
    constructor({ PedidoID, fecha, hora, estado, createdAt, updatedAt }) {
        this.PedidoID = PedidoID;
        this.fecha = fecha;
        this.hora = hora;
        this.estado = estado;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT PedidoID, fecha, hora, estado, deleted, created_at, updated_at FROM pedidos WHERE deleted = 0";

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

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, fecha, hora, estado, created_at AS createdAt, updated_at AS updatedAt FROM pedidos WHERE id = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Pedido({ id: row.id, fecha: row.fecha, hora: row.hora, estado: row.estado, createdAt: row.createdAt, updatedAt: row.updatedAt });
        }

        return null;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = await connection.execute("UPDATE pedidos SET deleted = 1, deleted_at = ? WHERE id = ?", [deletedAt, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el pedido");
        }

        return;
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM pedidos WHERE id = ?", [id]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se eliminó el pedido");
        }

        return;
    }

    static async updateById(id, { fecha, hora, estado }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE pedidos SET fecha = ?, hora = ?, estado = ?, updated_at = ? WHERE id = ?", [fecha, hora, estado, updatedAt, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó el pedido");
        }

        return;
    }
}

module.exports = Pedido;
