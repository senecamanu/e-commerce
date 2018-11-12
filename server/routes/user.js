const express = require('express'),
      routes = express.Router(),
      UserController = require('../controllers/user.js');


// ADMIN
routes.post('/a', UserController.createAdmin) // ? creates an admin
routes.post('/as', UserController.signInAdmin) // ? signIn an admin

// READ
routes.get('/', UserController.findAll) // ? finds all user
routes.post('/cc', UserController.checkCart) // ? checks if an item is already inside the cart
routes.post('/cl', UserController.cartList) // ? respond with full cart
routes.post('/si', UserController.signIn) // ? sign in verification
routes.get('/:id', UserController.findOne) // ? finds just one user

// CREATE
routes.post('/', UserController.create) // ? creates a new user

// UPDATE
routes.put('/c', UserController.updateCart); // ? adds an item to cart. header is JWT, body is the item's ID
routes.put("/:id", UserController.update);

// DELETE
routes.delete('/:id', UserController.delete)

module.exports = routes