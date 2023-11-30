module.exports = {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'Bryam203A',
      database: 'migrations',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    }, 
    useNullAsDefault: true
  };
  