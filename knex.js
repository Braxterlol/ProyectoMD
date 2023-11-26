require('dotenv').config();
const { configConnection } = require('./src/configs/db.config')

module.exports = {
    client: 'mysql2',
    connection: configConnection,
    migrations: {
        tableName: process.env.MIGRATION_DB,
        directory: process.env.MIGRATION_DIR
    },
    seeds: {
        directory: process.env.SEEDS_DIR
    },
    pool: {
        min: Number(process.env.DB_POOL_MIN),
        max: Number(process.env.DB_POOL_MAX)
    },
    acquireConnectionTimeout: Number(process.env.DB_TIMEOUT)
}