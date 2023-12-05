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
        let query = "SELECT pedido_id, fecha, estado, created_at, updated_at FROM pedidos where deleted = 0";

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
        const [rows] = await connection.execute("SELECT pedido_id, fecha, estado, created_at AS createdAt, updated_at AS updatedAt FROM pedidos WHERE PedidoID = ?", [PedidoID]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Pedido({ PedidoID: row.PedidoID, fecha: row.fecha, estado: row.estado, createdAt: row.createdAt, updatedAt: row.updatedAt });
        }

        return null;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("UPDATE pedidos SET deleted = 1 WHERE pedido_id = ?", [id]);
        connection.end();
    
        if (result.affectedRows === 0) {
            throw new Error("No se desactivó el usuario");
        }
    
        return;
    }

    static async getPaginatedOrders({ offset, limit }) {
        const connection = await db.createConnection();

        try {
            const [results, fields] = await connection.execute('CALL obtener_pedidos_paginados(?, ?, @total)', [offset, limit]);
            const [totalRows] = await connection.query('SELECT @total AS total');
            const total = totalRows[0].total;

            return { pedidos: results[0], total };
        } catch (error) {
            console.error('Error al llamar al stored procedure para obtener pedidos paginados:', error);
            throw error;
        } finally {
            connection.end();
        }
    }
    
    static async updateById(PedidoID, { fecha, estado }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE pedidos SET fecha = ?, estado = ?, updated_at = ? WHERE pedido_id = ?", [fecha, estado, updatedAt, PedidoID]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se actualizó el pedido");
        }

        return;
    }
   
  

    async save(detalles) {
        const connection = await db.createConnection();
    
        // Iniciar la transacción
        await connection.beginTransaction();
    
        try {
            const createdAt = new Date();
            const formattedDate = createdAt.toISOString().slice(0, 19).replace("T", " ");
    
            // Insertar el pedido principal
            const [resultPedido] = await connection.execute("INSERT INTO pedidos (fecha, estado, created_at) VALUES (?, ?, ?)", [createdAt, this.estado, createdAt]);
    
            if (resultPedido.insertId === 0) {
                throw new Error("No se insertó el pedido");
            }
    
            // Guardar el ID del pedido principal
            this.id = resultPedido.insertId;
            this.createdAt = createdAt;
            this.updatedAt = null;
    
            // Iterar sobre los detalles del pedido y agregarlos a la base de datos
            for (const detalleInfo of detalles) {
                const [resultDetalle] = await connection.execute("INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, created_at) VALUES (?, ?, ?, ?, ?)", [this.id, detalleInfo.ProductoID, detalleInfo.cantidad, detalleInfo.precio_unitario, createdAt]);
    
                if (resultDetalle.insertId === 0) {
                    throw new Error("No se insertó el detalle del pedido");
                }
            }
    
            // Confirmar la transacción
            await connection.commit();
    
            console.log('Pedido y detalles guardados exitosamente');
        } catch (error) {
            // Revertir la transacción en caso de error
            await connection.rollback();
            console.error('Error al guardar el pedido y detalles:', error);
            throw error; // Puedes manejar el error según tus necesidades
        } finally {
            // Cerrar la conexión
            connection.end();
        }
    }
    
}



module.exports = Pedido;
