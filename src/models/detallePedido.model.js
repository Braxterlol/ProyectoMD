const db = require('../configs/db.config');

class DetallePedido {
    constructor({ DetallePedidoID, PedidoID, ProductoID, cantidad, precio_unitario, createdAt, updatedAt }) {
        this.DetallePedidoID = DetallePedidoID;
        this.pedidoId = PedidoID;
        this.productoId = ProductoID;
        this.cantidad = cantidad;
        this.precio_unitario = precio_unitario;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT DetallePedidoID, PedidoID, ProductoID, cantidad, precio_unitario, created_at, updated_at FROM detallepedido";

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

    static async getById(DetallePedidoID) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT DetallePedidoID, PedidoID, ProductoID, cantidad, precio_unitario, created_at AS createdAt, updated_at AS updatedAt FROM detallepedido WHERE DetallePedidoID = ?", [DetallePedidoID]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new DetallePedido({ DetallePedidoID: row.DetallePedidoID, PedidoID: row.PedidoID, ProductoID: row.ProductoID, cantidad: row.cantidad, precio_unitario: row.precio_unitario, createdAt: row.createdAt, updatedAt: row.updatedAt });
        }

        return null;
    }

    static async deleteFisicoById(DetallePedidoID) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM detallepedido WHERE DetallePedidoID = ?", [DetallePedidoID]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se eliminó el detalle del pedido");
        }

        return;
    }
    
    static async updateById(DetallePedidoID, { PedidoID, ProductoID, cantidad, precio_unitario }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute(
            "UPDATE detallepedido SET PedidoID = ?, ProductoID = ?, cantidad = ?, precio_unitario = ?, updated_at = ? WHERE DetallePedidoID = ?",
            [PedidoID, ProductoID, cantidad, precio_unitario, updatedAt, DetallePedidoID]
        );

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó el detalle del pedido");
        }

        return;
    }

    async save() {
        const connection = await db.createConnection();

        const createdAt = new Date();

        const [result] = await connection.execute("INSERT INTO detallepedido (PedidoID, ProductoID, cantidad, precio_unitario, created_at) VALUES (?, ?, ?, ?, ?)", [this.PedidoID, this.ProductoID, this.cantidad, this.precio_unitario, createdAt]);
        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el detalle del pedido");
        }
        this.DetallePedidoID = result.insertId;
        this.createdAt = createdAt;
        this.updatedAt = null;
        return
    }
}

module.exports = DetallePedido;