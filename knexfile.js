'use strict';

module.exports = {

production: {
  client: 'pg',
  connection: process.env.DATABASE_URL
},

  development: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_dev'
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_test'
  },

};
