const DetallePedido = require('../models/detallePedido.model');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const { sort, order } = req.query;

        const detallesPedidos = await DetallePedido.getAll({ offset, limit }, { sort, order });

        let response = {
            message: "detalles de pedidos obtenidos exitosamente",
            data: detallesPedidos
        };

        if (page && limit) {
            const totalDetalles = await DetallePedido.count();
            response = {
                ...response,
                total: totalDetalles,
                totalPages: Math.ceil(totalDetalles / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los detalles de pedidos",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idDetallePedido = req.params.id;
        const detallePedido = await DetallePedido.getById(idDetallePedido);

        if (!detallePedido) {
            return res.status(404).json({
                message: `no se encontró el detalle del pedido con id ${idDetallePedido}`
            });
        };

        return res.status(200).json({
            message: "detalle del pedido encontrado exitosamente",
            detallePedido
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el detalle del pedido",
            error: error.message
        });
    }
}

const getByPedidoId = async (req, res) => {
    try {
        const pedidoId = req.params.pedidoId;
        const detallesPedidos = await DetallePedido.getByPedidoId(pedidoId);

        return res.status(200).json({
            message: `detalles de pedidos del pedido con id ${pedidoId} obtenidos exitosamente`,
            data: detallesPedidos
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los detalles de pedidos",
            error: error.message
        });
    }
}

const deleteFisico = async (req, res) => {
    try {
        const idDetallePedido = req.params.id;

        await DetallePedido.deleteFisicoById(idDetallePedido);

        return res.status(200).json({
            message: "se eliminó el detalle del pedido correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el detalle del pedido",
            error: error.message
        })
    }
}

const create = async (req, res) => {
    try {
        const detallePedido = new DetallePedido({
            pedidoId: req.body.pedidoId,
            productoId: req.body.productoId,
            cantidad: req.body.cantidad,
            precioUnitario: req.body.precioUnitario
        });

        await detallePedido.save();

        return res.status(200).json({
            message: "detalle del pedido creado exitosamente",
            detallePedido
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el detalle del pedido",
            error: error.message
        });
    }

    
}
const update = async (req, res) => {
    try {
        const idDetallePedido = req.params.id;
        const datosActualizar = {
            pedidoId: req.body.pedidoId,
            productoId: req.body.productoId,
            cantidad: req.body.cantidad,
            precioUnitario: req.body.precioUnitario
        }

        await DetallePedido.updateById(idDetallePedido, datosActualizar);

        return res.status(200).json({
            message: "el detalle del pedido se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el detalle del pedido",
            error: error.message
        })
    }
}

module.exports = {
    index,
    getById,
    getByPedidoId,
    delete: deleteFisico,
    create,
    update
}
