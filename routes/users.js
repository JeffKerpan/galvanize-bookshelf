'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/users', (req, res, next) => {
  const body = req.body;
  body.password = bcrypt.hashSync(body.password, saltRounds);
  knex('users').returning(['id', 'first_name as firstName', 'last_name as lastName', 'email']).insert({
    first_name: body.firstName,
    last_name: body.lastName,
    email: body.email,
    hashed_password: body.password
  }).then(result => {
    res.send(result[0]);
  });
});


// YOUR CODE HERE

module.exports = router;
