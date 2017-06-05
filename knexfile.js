'use strict';

module.exports = {
  development: {
    clieng: 'pg',
    connection: 'postgres://localhost/bookshelf_dev'
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_test'
  },

};
