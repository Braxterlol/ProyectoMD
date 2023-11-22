const db = require('../configs/db.config');

class Producto {
    constructor({ ProductoID, nombre, descripcion, precio, tipo, estatus, createdAt, updatedAt }) {
        this.ProductoID = ProductoID;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.tipo = tipo;
        this.estatus = estatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT ProductoID, nombre, descripcion, precio, tipo, estatus, created_at, updated_at FROM productos";

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
        const [rows] = await connection.execute("SELECT ProductoID, nombre, descripcion, precio, tipo, estatus, created_at AS createdAt, updated_at AS updatedAt FROM productos WHERE ProductoID = ?", [ProductoID]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Producto({ ProductoID: row.ProductoID, nombre: row.nombre, descripcion: row.descripcion, precio: row.precio, tipo: row.tipo, estatus: row.estatus, createdAt: row.createdAt, updatedAt: row.updatedAt });
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

    static async updateById(ProductoID, { nombre, descripcion, precio, tipo, estatus }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, tipo = ?, estatus = ?, updated_at = ? WHERE ProductoID = ?", [nombre, descripcion, precio, tipo, estatus, updatedAt, ProductoID]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó el producto");
        }

        return;
    }

    static async getByTipo(tipo) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT ProductoID, nombre, descripcion, precio, tipo, estatus, created_at AS createdAt, updated_at AS updatedAt FROM productos WHERE tipo = ?", [tipo]);
        connection.end();
    
        return rows.map(row => new Producto({
            ProductoID: row.ProductoID,
            nombre: row.nombre,
            descripcion: row.descripcion,
            precio: row.precio,
            tipo: row.tipo,
            estatus: row.estatus,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        }));
    }

    async save() {
        const connection = await db.createConnection();
    
        try {
            // Verificar si ya existe un producto con el mismo nombre
            const [existingProduct] = await connection.execute("SELECT ProductoID FROM productos WHERE nombre = ? LIMIT 1", [this.nombre]);
    
            if (existingProduct.length !== 0) {
                throw new Error("Ya existe un producto con este nombre");
            }
    
            const createdAt = new Date();
            const [result] = await connection.execute("INSERT INTO productos (nombre, descripcion, precio, tipo, estatus, created_at) VALUES (?, ?, ?, ?, ?, ?)", [this.nombre, this.descripcion, this.precio, this.tipo, this.estatus, createdAt]);
    
            if (result.insertId === 0) {
                throw new Error("No se insertó el producto");
            }
    
            this.ProductoID = result.insertId;
            this.createdAt = createdAt;
            this.updatedAt = null;
    
            return;
        } catch (error) {
            throw error; // Propaga el error para que pueda ser manejado en el controlador
        } finally {
            connection.end();
        }
    }
}
module.exports = Producto;
