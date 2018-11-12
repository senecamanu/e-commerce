const express = require('express'),
  routes = express.Router(),
  TransactionController = require('../controllers/transaction.js');

routes.post('/', TransactionController.create) // ? Creates a new transaction


module.exports = routes