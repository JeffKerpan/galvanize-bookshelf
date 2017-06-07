'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

router.get('/token', (req, res, next) => {
  var token = req.cookies.token;
  jwt.verify(token, 'secret', function(err, decoded) {
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
  res.cookie('token', '').send();
});

module.exports = router;
