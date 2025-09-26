require("dotenv").config();

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB || "migrations",
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN) || 1,
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      idleTimeoutMillis: parseInt(process.env.DB_TIMEOUT) || 1000,
    },
    migrations: {
      tableName: process.env.MIGRATION_DB || "knex_migrations",
      directory: process.env.MIGRATION_DIR || "./migrations",
    },
    seeds: {
      directory: process.env.SEEDS_DIR || "./seeds",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      max: parseInt(process.env.DB_POOL_MAX) || 20,
      idleTimeoutMillis: parseInt(process.env.DB_TIMEOUT) || 1000,
    },
    migrations: {
      tableName: process.env.MIGRATION_DB || "knex_migrations",
      directory: process.env.MIGRATION_DIR || "./migrations",
    },
    seeds: {
      directory: process.env.SEEDS_DIR || "./seeds",
    },
    useNullAsDefault: true,
  },
};
