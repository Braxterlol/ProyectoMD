const Producto = require('../models/producto.model');
const multer = require('multer');
const path = require('path');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const { sort, order } = req.query;

        const productos = await Producto.getAll({ offset, limit }, { sort, order });

        let response = {
            message: "productos obtenidos exitosamente",
            data: productos
        };

        if (page && limit) {
            const totalProductos = await Producto.count();
            response = {
                ...response,
                total: totalProductos,
                totalPages: Math.ceil(totalProductos / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los productos",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idProducto = req.params.id;
        const producto = await Producto.getById(idProducto);

        if (!producto) {
            return res.status(404).json({
                message: `no se encontró el producto con id ${idProducto}`
            });
        };

        return res.status(200).json({
            message: "producto encontrado exitosamente",
            producto
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el producto",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const producto = new Producto({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            tipo: req.body.tipo,
            estatus: req.body.estatus || 1
        });

        await producto.save();

        return res.status(200).json({
            message: "producto creado exitosamente",
            producto
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el producto",
            error: error.message
        });
    }
}

const deleteFisico = async (req, res) => {
    try {
        const idProducto = req.params.id;

        await Producto.deleteFisicoById(idProducto);

        return res.status(200).json({
            message: "se eliminó el producto correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el producto",
            error: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const idProducto = req.params.id;
        const datosActualizar = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            tipo: req.body.tipo,
            estatus: req.body.estatus 
        }

        await Producto.updateById(idProducto, datosActualizar);

        return res.status(200).json({
            message: "el producto se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el producto",
            error: error.message
        })
    }
}

module.exports = {
    index,
    getById,
    create,
    delete: deleteFisico,
    update
}
