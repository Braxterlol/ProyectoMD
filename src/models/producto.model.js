const db = require('../configs/db.config');

class Producto {
    constructor({ ProductoID, nombre, descripcion, precio, tipo, createdAt, updatedAt }) {
        this.ProductoID = ProductoID;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.tipo = tipo;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT ProductoID, nombre, descripcion, precio, tipo,  deleted, created_at, updated_at FROM productos WHERE deleted = 0";

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
        const [rows] = await connection.execute("SELECT id, nombre, descripcion, precio, tipo, created_at AS createdAt, updated_at AS updatedAt FROM productos WHERE id = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Producto({ id: row.id, nombre: row.nombre, descripcion: row.descripcion, precio: row.precio, tipo: row.tipo, createdAt: row.createdAt, updatedAt: row.updatedAt });
        }

        return null;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = await connection.execute("UPDATE productos SET deleted = 1, deleted_at = ? WHERE id = ?", [deletedAt, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el producto");
        }

        return;
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM productos WHERE id = ?", [id]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se eliminó el producto");
        }

        return;
    }

    static async updateById(id, { nombre, descripcion, precio, tipo }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, tipo = ?, updated_at = ? WHERE id = ?", [nombre, descripcion, precio, tipo, updatedAt, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó el producto");
        }

        return;
    }
}

module.exports = Producto;
