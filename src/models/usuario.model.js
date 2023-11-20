const db = require('../configs/db.config');

class Usuario {

    constructor({ id, email, password, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT id, email, password, created_at, updated_at FROM usuarios";

        if (sort && order) {
            query += ` ORDER BY ${sort} ${order}`
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
        const [rows] = await connection.execute("SELECT id, email, password, created_at, updated_at FROM usuarios WHERE id = ?", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Usuario({ id: row.id, email: row.email, password: row.password, createdAt: row.created_at, updatedAt: row.updated_at });
        }

        return null;
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM usuarios WHERE id = ?", [id]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se eliminó el usuario");
        }

        return;
    }

    static async updateById(id, { email, password }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE usuarios SET email = ?, password = ?, updated_at = ? WHERE id = ?", [email, password, updatedAt, id]);

        if (result.affectedRows == 0) {
            throw new Error("no se actualizó el usuario");
        }

        return
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
        const [result] = await connection.execute("INSERT INTO usuarios (email, password, created_at) VALUES (?, ?, ?)", [this.email, this.password, createdAt]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el usuario");
        }

        this.id = result.insertId;
        this.createdAt = createdAt;
        this.updatedAt = null;
        return
    }
}

module.exports = Usuario;