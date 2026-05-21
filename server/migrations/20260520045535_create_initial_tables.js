/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
      table.timestamps(true, true);
    })
    .createTable('categories', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('slug').unique().notNullable();
      table.text('description');
      table.string('image_url');
      table.timestamps(true, true);
    })
    .createTable('products', table => {
      table.increments('id').primary();
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('slug').unique().notNullable();
      table.text('description');
      table.text('benefits');
      table.text('ingredients');
      table.string('image_url');
      table.boolean('is_featured').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('inquiries', table => {
      table.increments('id').primary();
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('SET NULL');
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('phone');
      table.text('message');
      table.string('status').defaultTo('new');
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('inquiries')
    .dropTableIfExists('products')
    .dropTableIfExists('categories')
    .dropTableIfExists('users');
};
