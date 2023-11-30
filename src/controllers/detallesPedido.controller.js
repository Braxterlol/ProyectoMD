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
            const totalDetallesPedidos = await DetallePedido.count();
            response = {
                ...response,
                total: totalDetallesPedidos,
                totalPages: Math.ceil(totalDetallesPedidos / limit),
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
                message: `no se encontró el detalle de pedido con id ${idDetallePedido}`
            });
        }

        return res.status(200).json({
            message: "detalle de pedido encontrado exitosamente",
            detallePedido
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el detalle de pedido",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const detallePedido = new DetallePedido({
            PedidoID: req.body.PedidoID,
            ProductoID: req.body.ProductoID,
            cantidad: req.body.cantidad,
            precio_unitario: req.body.precio_unitario
        });

        await detallePedido.save();

        return res.status(200).json({
            message: "detalle de pedido creado exitosamente",
            detallePedido
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el detalle de pedido",
            error: error.message
        });
    }
}

const deleteLogicoById = async (req, res) => {
    try {
        const idDetallePedido = req.params.id;

        await DetallePedido.deleteFisicoById(idDetallePedido);

        return res.status(200).json({
            message: "se eliminó el detalle de pedido correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el detalle de pedido",
            error: error.message
        });
    }
}

const update = async (req, res) => {
    try {
        const idDetallePedido = req.params.id;
        const datosActualizar = {
            PedidoID: req.body.PedidoID,
            ProductoID: req.body.ProductoID,
            cantidad: req.body.cantidad,
            precio_unitario: req.body.precio_unitario
        }

        await DetallePedido.updateById(idDetallePedido, datosActualizar);

        return res.status(200).json({
            message: "el detalle de pedido se actualizó correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el detalle de pedido",
            error: error.message
        });
    }
}

const totalFecha = async (req, res) => {
    try {
        const fechaPedido = req.params.fecha;

        const totalPedidos = await DetallePedido.calcularTotalPedidosPorFecha(fechaPedido);

        return res.status(200).json({
            message: `Total de pedidos para ${fechaPedido}: ${totalPedidos}`,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al calcular el total de pedidos por fecha",
            error: error.message,
        });
    }
};

const total = async (req, res) => {
    try {
        const totalPedidos = await DetallePedido.calcularTotalPedidos();

        return res.status(200).json({
            message: 'Total de pedidos calculado exitosamente',
            totalPedidos,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrió un error al calcular el total de pedidos',
            error: error.message,
        });
    }
};

module.exports = {
    index,
    getById,
    create,
    totalFecha,
    total,
    delete: deleteLogicoById,
    update
}
