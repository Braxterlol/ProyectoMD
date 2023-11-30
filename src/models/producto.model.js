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
        let query = "SELECT producto_id, nombre, descripcion, precio, tipo, estatus, created_at, updated_at FROM productos";

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
        const [rows] = await connection.execute("SELECT producto_id, nombre, descripcion, precio, tipo, estatus, created_at AS createdAt, updated_at AS updatedAt FROM productos WHERE producto_id = ?", [ProductoID]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Producto({ ProductoID: row.ProductoID, nombre: row.nombre, descripcion: row.descripcion, precio: row.precio, tipo: row.tipo, estatus: row.estatus, createdAt: row.createdAt, updatedAt: row.updatedAt });
        }

        return null;
    }


    static async deleteLogicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("UPDATE productos SET deleted = 1 WHERE id = ?", [id]);
        connection.end();
    
        if (result.affectedRows === 0) {
            throw new Error("No se desactivó el usuario");
        }
    
        return;
    }

    static async getPaginatedProductsSP({ offset, limit }) {
        const connection = await db.createConnection();
        try {
          const [results, fields] = await connection.execute('CALL obtener_productos_paginados(?, ?, @total)', [offset, limit]);
          const [totalRows] = await connection.query('SELECT @total AS total');
          const total = totalRows[0].total;
    
          return { productos: results[0], total };
        } catch (error) {
          console.error('Error al llamar al stored procedure para obtener productos paginados:', error);
          throw error;
        } finally {
          connection.end();
        }
      }

    static async updateById(ProductoID, { nombre, descripcion, precio, tipo }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, tipo = ?, updated_at = ? WHERE producto_id = ?", [nombre, descripcion, precio, tipo, updatedAt, ProductoID]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó el producto");
        }

        return;
    }

    static async getByTipo(tipo) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT producto_id, nombre, descripcion, precio, tipo, estatus, created_at AS createdAt, updated_at AS updatedAt FROM productos WHERE tipo = ? and estatus = 1 and deleted = 0", [tipo]);
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

    static async updateEstatusById(ProductoID, estatus) {
        const connection = await db.createConnection();
    
        try {
          const updatedAt = new Date();
          const [result] = await connection.execute("UPDATE productos SET estatus = ?, updated_at = ? WHERE producto_id = ?", [estatus, updatedAt, ProductoID]);
    
          if (result.affectedRows === 0) {
            throw new Error("No se actualizó el estatus del producto");
          }
    
          return;
        } catch (error) {
          throw error; 
        } finally {
          connection.end();
        }
      }
    

    async save() {
        const connection = await db.createConnection();
    
        try {
          
            const [existingProduct] = await connection.execute("SELECT producto_id FROM productos WHERE nombre = ? LIMIT 1", [this.nombre]);
    
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
