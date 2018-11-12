const express = require('express'),
      routes = express.Router(),
      CategoryController = require('../controllers/category.js');

// READ
routes.get('/', CategoryController.findAll) // ? finds all items
routes.get('/:name', CategoryController.findOneByName) // ? finds category by name
routes.get('/id/:id', CategoryController.findOneById) // ? finds category by name
// CREATE
routes.post('/', CategoryController.create) // ? creates a new category
// UPDATE
routes.put('/:id', CategoryController.update)
// DELETE
routes.delete('/:id', CategoryController.delete)

module.exports = routes