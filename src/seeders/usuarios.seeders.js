const db = require('../configs/db.config');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

async function seedUsuarios() {
    const usuariosData = [
        {
            email: 'usuario1@example.com',
            password: bcrypt.hashSync('contraseña1', saltosBcrypt),
            isAdmin: 0
        },
    ];

    const connection = await db.createConnection();

    for (const userData of usuariosData) {
        const usuario = new Usuario({
            email: userData.email,
            password: userData.password,
            isAdmin: userData.isAdmin,
        });

        await usuario.save();
    }

    connection.end();
}


seedUsuarios()
    .then(() => {
        console.log('Usuarios sembrados exitosamente.');
    })
    .catch((error) => {
        console.error('Error al sembrar usuarios:', error);
    });
