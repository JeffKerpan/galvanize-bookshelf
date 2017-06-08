//books.js routes build and burn
// 'use strict';
//
// const express = require('express');
// const router = express.Router();
// const knex = require('../knex');
// const humps = require('humps');
//
// router.get('/books', (req, res, next) => {
//   knex('books').select('id', 'title', 'genre', 'description', 'author', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt').orderBy('title').then(result => {
//     res.send(result);
//   });
// });
//
// router.get('books/:id', (req, res, next) => {
//   knex('books').select('id', 'author', 'genre', 'description', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt').then(result => {
//     res.send(result[0]);
//   });
// });
//
// router.post('/books', (req, res, next) => {
// knex('books').returning('*').insert(humps.decamelizeKeys(req.body)).then(result => {
//   res.send(humps.camelizeKeys(result[0]));
//   });
// });
//
// router.patch('/books/:id', (req, res, next) => {
//   var id = req.params.id;
//   var body = humps.decamelizeKeys(req.body);
//   knex('books').where('id', id).update(body).returning('*').then(response => {
//     response = humps.camelizeKeys(response);
//     res.send(response[0]);
//   });
// });
//
// router.delete('/books/:id', (req, res, next) => {
//   var id = req.params.id;
//   knex('books').where('id', id).del().returning('*').then(response => {
//     response = humps.camelizeKeys(response);
//     delete response[0].id;
//     res.send(response[0]);
//   });
// });
//
// module.exports = router;


//token.js routes build and burn
'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

router.get('/token', (req, res, next) => {
  var token = req.cookies.token;
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.send(false);
    }
    res.send(true);
  });
});

router.post('/token', (req, res, next) => {
  const body = req.body;
  knex('users').select('id', 'first_name as firstName', 'last_name as lastName', 'email', 'hashed_password as password').then(result => {
    if (result[0].email !== req.body.email) {
      return res.status(400).type('text/plain').send('Bad email or password');
    }
    var pass = bcrypt.compareSync(req.body.password, result[0].password);
    if (pass) {
      delete result[0].password;
      var token = jwt.sign(result[0], 'secret');
      res.cookie('token', token, {httpOnly: true});
      return res.send(result[0]);
    } else {
      return res.status(400).type('text/plain').send('Bad email or password');
    }
  });
});

router.delete('/token', (req, res, next) => {
  res.clearCookie('token').send();
});

module.exports = router;
