const db = require('../configs/db.config');

class Producto {
    constructor({ ProductoID, nombre, descripcion, precio, tipo, createdAt, updatedAt }) {
        this.ProductoID = ProductoID;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.tipo = tipo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT ProductoID, nombre, descripcion, precio, tipo, created_at, updated_at FROM productos";

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

    static async getById(ProductoID) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT ProductoID, nombre, descripcion, precio, tipo, created_at AS createdAt, updated_at AS updatedAt FROM productos WHERE ProductoID = ?", [ProductoID]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Producto({ ProductoID: row.ProductoID, nombre: row.nombre, descripcion: row.descripcion, precio: row.precio, tipo: row.tipo, createdAt: row.createdAt, updatedAt: row.updatedAt });
        }

        return null;
    }


    static async deleteFisicoById(ProductoID) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM productos WHERE ProductoID = ?", [ProductoID]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se eliminó el producto");
        }

        return;
    }

    static async updateById(ProductoID, { nombre, descripcion, precio, tipo }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, tipo = ?, updated_at = ? WHERE ProductoID = ?", [nombre, descripcion, precio, tipo, updatedAt, ProductoID]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó el producto");
        }

        return;
    }
    async save() {
        const connection = await db.createConnection();

        const createdAt = new Date();
        const [result] = await connection.execute("INSERT INTO productos (nombre, descripcion, precio, tipo, created_at) VALUES (?, ?, ?, ?, ?)", [this.nombre, this.descripcion, this.precio, this.tipo, createdAt]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el producto");
        }

        this.ProductoID = result.insertId;
        this.createdAt = createdAt;
        this.updatedAt = null;

        return
    }
}

module.exports = Producto;
