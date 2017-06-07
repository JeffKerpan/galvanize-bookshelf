
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('first_name', 255).notNullable().defaultTo('');
    table.string('last_name', 255).notNullable().defaultTo('');
    table.string('email', 255).notNullable();
    table.specificType('hashed_password', 'char(60)' ).notNullable();
    table.timestamps(true, true);
    table.unique('email');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
