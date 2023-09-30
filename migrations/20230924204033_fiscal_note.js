/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('fiscal_note', function (table) {
      table.increments('id');
      table.string('key').notNullable().unique();
      table.dateTime('date').notNullable();
    })
    .createTable('item', function (table) {
      table.increments('id');
      table.string('name').notNullable().unique();
      table.string('category');
    })
    .createTable('fiscal_note_item', function (table) {
      table.increments('id');
      table.integer('fiscal_note_id').index().references('id').inTable('fiscal_note').notNullable();
      table.integer('item_id').index().references('id').inTable('item').notNullable();
      table.double('price').notNullable();
      table.double('quantity').notNullable();
      table.string('unity').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable("fiscal_note_item")
    .dropTable("fiscal_note")
    .dropTable("item")
};
