const db = require('../configs/db.config');

class DetallePedido {
    constructor({ DetallePedidoID, pedidoId, productoId, cantidad, precioUnitario, createdAt, updatedAt }) {
        this.DetallePedidoID = DetallePedidoID;
        this.pedidoId = pedidoId;
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT DetallePedidoID, PedidoID, ProductoID, cantidad, precio_unitario, deleted, created_at, updated_at FROM detallepedido WHERE deleted = 0";

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
        const [rows] = await connection.execute("SELECT id, pedido_id, producto_id, cantidad, precio_unitario, created_at AS createdAt, updated_at AS updatedAt FROM detalles_pedidos WHERE id = ?", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new DetallePedido({ id: row.id, pedidoId: row.pedido_id, productoId: row.producto_id, cantidad: row.cantidad, precioUnitario: row.precio_unitario, createdAt: row.createdAt, updatedAt: row.updatedAt });
        }

        return null;
    }

    static async getByPedidoId(pedidoId) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, pedido_id, producto_id, cantidad, precio_unitario, created_at AS createdAt, updated_at AS updatedAt FROM detalles_pedidos WHERE pedido_id = ?", [pedidoId]);
        connection.end();

        return rows.map(row => new DetallePedido({ id: row.id, pedidoId: row.pedido_id, productoId: row.producto_id, cantidad: row.cantidad, precioUnitario: row.precio_unitario, createdAt: row.createdAt, updatedAt: row.updatedAt }));
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM detalles_pedidos WHERE id = ?", [id]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se eliminó el detalle del pedido");
        }

        return;
    }
    
    static async updateById(id, { pedidoId, productoId, cantidad, precioUnitario }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute(
            "UPDATE detalles_pedidos SET pedido_id = ?, producto_id = ?, cantidad = ?, precio_unitario = ?, updated_at = ? WHERE id = ?",
            [pedidoId, productoId, cantidad, precioUnitario, updatedAt, id]
        );

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó el detalle del pedido");
        }

        return;
    }

    async save() {
        const connection = await db.createConnection();

        const [result] = await connection.execute("INSERT INTO detalles_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)", [this.pedidoId, this.productoId, this.cantidad, this.precioUnitario]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el detalle del pedido");
        }

        this.id = result.insertId;
        this.createdAt = new Date(); 

        return;
    }
}

module.exports = DetallePedido;
