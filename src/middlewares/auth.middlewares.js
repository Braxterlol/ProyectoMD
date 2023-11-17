const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const verificarJwt = (req, res, next) => {
    const token = req.get('Authorization');

    jwt.verify(token, jwtSecret, (err, decode) => {
        if (err) {
            return res.status(401).send({
                message: 'hubo un error al validar el token',
                error: err.message
            });
        }

        req.cliente = decode.cliente;
        next();
    })
};


module.exports = {
    verificarJwt
}