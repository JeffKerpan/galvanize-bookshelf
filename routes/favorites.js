'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const humps = require('humps');
const dotenv = require('dotenv').config();

router.use('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }
      req.user = decoded;
      return next();
  });
});

router.get('/favorites', (req, res, next) => {
  knex('favorites').select('favorites.id', 'book_id as bookId', 'user_id as userId', 'books.created_at as createdAt', 'books.updated_at as updatedAt', 'title', 'author', 'genre', 'description', 'cover_url as coverUrl').innerJoin('books', 'favorites.book_id', 'books.id').then(result => {
    res.send(result);
  });
});

router.get('/favorites/check?', (req, res, next) => {
  knex('favorites').select('book_id').where('id', parseInt(req.query.bookId)).then(result => {
    if (result.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

router.post('/favorites', (req, res, next) => {
  knex('favorites').insert({book_id: req.body.bookId, user_id: 1}, '*').then(result => {
    return res.status(200).send(humps.camelizeKeys(result[0]));
  });
});

// router.post('/favorites', (req, res, next) => {
//   var body = req.body;
//   var token = req.cookies.token;
//   var user;
//   jwt.verify(token, 'secret', (err, decoded) => {
//     user = decoded;
//     knex('favorites').insert({book_id: req.body.bookId, user_id: 1}).returning('id', 'book_id as bookId', 'user_id as userId').then(result => {
//       return res.send(result);
//     });
//   });
//   console.log(user);
//
// });

router.delete('/favorites', (req, res, next) => {
  knex('favorites').where('book_id', req.body.bookId).returning(['book_id as bookId', 'user_id as userId']).del().then(result => {
    return res.status(200).send(result[0]);
  });
});

module.exports = router;
