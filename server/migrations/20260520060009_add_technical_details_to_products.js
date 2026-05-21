/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('products', table => {
    table.string('flavours');
    table.string('packing_material');
    table.string('packing_size');
    table.string('shelf_life');
    table.string('moq');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('products', table => {
    table.dropColumn('flavours');
    table.dropColumn('packing_material');
    table.dropColumn('packing_size');
    table.dropColumn('shelf_life');
    table.dropColumn('moq');
  });
};
