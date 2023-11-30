/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('DetallePedidos', function(table) {
        table.increments('DetallePedidoID').primary();
        table.integer('PedidoID').unsigned();
        table.integer('ProductoID').unsigned();
        table.integer('cantidad');
        table.string('estatus_pedido', 255); 
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        
        table.foreign('PedidoID').references('PedidoID').inTable('Pedidos');
        table.foreign('ProductoID').references('ProductoID').inTable('Productos');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('DetallePedidos');
};
