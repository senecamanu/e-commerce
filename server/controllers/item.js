const axios = require('axios'),
      Item = require('../models/item'),
      User = require('../models/user'),
      // Admin = require('../models/admin'),
      Transaction = require('../models/transaction'),
      cart = require('../models/cart'),
      Category = require('../models/category'),
      ObjectId = require('mongodb').ObjectId

const MongoClient = require('mongodb').MongoClient,
      assert = require('assert'),
      url = 'mongodb://localhost:27017',
      dbName = 'maso',
      client = new MongoClient(url);

class ItemController {

  // R1
  static findAll(req, res) {
    Item.find({})
      .exec((err, result) => {
        err ?
          res.status(500).json({
            message: "Error",
            error: err
          }) :
          res.json({
            message: "Success",
            result: result
          })
      })
  }

  // R2
  static findByCategory(req, res) {
    Item.find({ category: req.params.itemCategory })
      .exec((err, result) => {
        err ? 
          res.status(500).json({
          message: "Error",
          error: err
          }) : 
          res.json({
            message: "Success",
            result: result
          })
      })
  }

  // R3
  static findOne(req, res) {
    Item.findOne({ _id: ObjectId(req.params.id) })
      .exec((err, result) => {
        err ?
          res.status(500).json({
            message: "Error",
            error: err
          }) :
          res.json({
            message: "Success",
            result: result
          })
      })
  }

  // C1
  static create(req, res) {
    const inp = req.body
    console.log(inp)
    const newItem = new Item({
      name: inp.name,
      price: inp.price,
      stock: inp.stock,
      image: inp.image,
      category: ObjectId(inp.category),
      deleted: false
    });

    newItem.save()
      .then(result => {
        res.json({
          message: "Success",
          result: result
        })
      })
      .catch(err => {
        res.json(err)
      })
  }

  // U1
  static update(req, res) {
    const inp = req.body
    Item.update(
        { _id: ObjectId(req.params.id) },
        { $set: inp },
        (err, result) => {
          err ?
            res.status(500).json({
              message: "Error",
              error: err
            }) :
            res.json({
              message: "Success",
              result: result
            })
        }
    )
  }

  // D1
  static delete(req, res) {
    Item.deleteOne({ _id: ObjectId(req.params.id)},
    (err, result) => {
      err ?
        res.status(500).json({
          message: "Error",
          error: err
        }) :
        res.json({
          message: "Success",
          result: result
        })
    })
  }

  // D2
  static pseudoDelete(req, res) {
    const inp = req.body;
    Item.update(
      { _id: ObjectId(req.params.id) },
      { $set: inp },
      (err, result) => {
        err ?
          res.status(500).json({
            message: "Error",
            error: err
          }) :
          res.json({
            message: "Success",
            result: result
          })
      }
    )
  }
}

module.exports = ItemController