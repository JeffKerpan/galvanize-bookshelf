'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');

router.get('/books', (req, res, next) => {
  knex('books').select('id', 'title', 'genre', 'description', 'author', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt').orderBy('title').then(result => {
    res.send(result);
  });
});

router.get('/books/:id', (req, res, next) => {
  knex('books').select('id', 'title', 'author', 'genre', 'description', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt').then(result => {
    res.send(result[0]);
  });
});

router.post('/books', (req, res, next) => {
  knex('books').returning('*').insert(humps.decamelizeKeys(req.body)).then(result => {
    res.send(humps.camelizeKeys(result[0]));
  });
});

router.patch('/books/:id', (req, res, next) => {
  var id = req.params.id;
  var body = humps.decamelizeKeys(req.body);
  knex('books').where('id', id).update(body).returning('*').then(response => {
    response = humps.camelizeKeys(response);
    res.send(response[0]);
  });
});

router.delete('/books/:id', (req, res, next) => {
  var id = req.params.id;
  knex('books').where('id', id).del().returning('*').then(response => {
    response = humps.camelizeKeys(response);
    delete response[0].id;
    res.send(response[0]);
  });
});

module.exports = router;
