const db = require('../configs/db.config');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

class Usuario {

    constructor({ id, email, password, is_admin, createdAt, updatedAt }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.is_admin = is_admin; // Agregada la propiedad isAdmin
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT id, email, password, is_admin, created_at, updated_at FROM usuarios"; // Añadida la columna isAdmin

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

    static async findOneByEmailAndPassword(email, password) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, email, password, is_admin, created_at, updated_at FROM usuarios WHERE email = ?", [email]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];

            const passwordMatch = await bcrypt.compare(password, row.password);

            if (passwordMatch) {
                return new Usuario({ id: row.id, email: row.email, password: row.password, is_admin: row.is_admin, createdAt: row.created_at, updatedAt: row.updated_at });
            }
        }

        return null;
    }

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, email, password, is_admin, created_at, updated_at FROM usuarios WHERE id = ?", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Usuario({ id: row.id, email: row.email, password: row.password, isAdmin: row.isAdmin, createdAt: row.created_at, updatedAt: row.updated_at });
        }

        return null;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("UPDATE usuarios SET deleted = 1 WHERE id = ?", [id]);
        connection.end();
    
        if (result.affectedRows === 0) {
            throw new Error("No se desactivó el usuario");
        }
    
        return;
    }

    static async updateById(id, { email, password, isAdmin }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE usuarios SET email = ?, password = ?, is_admin = ?, updated_at = ? WHERE id = ?", [email, password, isAdmin, updatedAt, id]);

        if (result.affectedRows == 0) {
            throw new Error("No se actualizó el usuario");
        }

        return;
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM usuarios");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();

        const createdAt = new Date();
        const [result] = await connection.execute("INSERT INTO usuarios (email, password, is_admin, created_at) VALUES (?, ?, ?, ?)", [this.email, this.password, this.is_admin, createdAt]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el usuario");
        }

        this.id = result.insertId;
        this.createdAt = createdAt;
        this.updatedAt = null;
        return;
    }
}

module.exports = Usuario;
