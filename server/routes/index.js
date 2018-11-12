const express = require('express'),
  routes = express.Router()

routes.use('/api/item', require('./item'))
routes.use('/api/category', require('./category'))
routes.use('/api/user', require('./user'))
routes.use('/api/transaction', require('./transaction'))

routes.use((req, res) => res.status(404).json({
  message: 'No page here. See API documentation for reference.'
}))

module.exports = routes