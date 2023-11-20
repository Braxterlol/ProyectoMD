const Pedido = require('../models/pedido.model');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const { sort, order } = req.query;

        const pedidos = await Pedido.getAll({ offset, limit }, { sort, order });

        let response = {
            message: "pedidos obtenidos exitosamente",
            data: pedidos
        };

        if (page && limit) {
            const totalPedidos = await Pedido.count();
            response = {
                ...response,
                total: totalPedidos,
                totalPages: Math.ceil(totalPedidos / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los pedidos",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idPedido = req.params.id;
        const pedido = await Pedido.getById(idPedido);

        if (!pedido) {
            return res.status(404).json({
                message: `no se encontró el pedido con id ${idPedido}`
            });
        };

        return res.status(200).json({
            message: "pedido encontrado exitosamente",
            pedido
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el pedido",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const pedido = new Pedido({
            fecha: req.body.fecha,
            estado: req.body.estado
        });

        await pedido.save();

        return res.status(200).json({
            message: "pedido creado exitosamente",
            pedido
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el pedido",
            error: error.message
        });
    }
}


const  deleteFisicoById = async (req, res) => {
    try {
        const idPedido = req.params.id;

        await Pedido.deleteFisicoById(idPedido);

        return res.status(200).json({
            message: "se eliminó el pedido correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el pedido",
            error: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const idPedido = req.params.id;
        const datosActualizar = {
            fecha: req.body.fecha,
            estado: req.body.estado
        }

        await Pedido.updateById(idPedido, datosActualizar);

        return res.status(200).json({
            message: "el pedido se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el pedido",
            error: error.message
        })
    }
}

module.exports = {
    index,
    getById,
    create,
    delete: deleteFisicoById,
    update
}
