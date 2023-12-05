const db = require('../configs/db.config');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

async function seedUsuarios() {
    const usuariosData = [
        {
            email: 'user1',
            password: bcrypt.hashSync('1234', saltosBcrypt),
            is_admin: 0
        },
    ];

    const connection = await db.createConnection();

    for (const userData of usuariosData) {
        const usuario = new Usuario({
            email: userData.email,
            password: userData.password,
            is_admin: userData.is_admin,
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
