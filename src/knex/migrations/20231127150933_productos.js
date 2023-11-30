/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Productos', function(table) {
        table.increments('ProductoID').primary();
        table.string('nombre', 255);
        table.text('descripcion');
        table.decimal('precio', 10, 2);
        table.string('tipo', 1);
        table.boolean('estatus').defaultTo(true);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Productos');
};
