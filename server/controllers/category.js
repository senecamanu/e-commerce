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
    Category.find({})
      .populate("itemsId")
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
  static findOneByName(req, res) {
    Category.find({ name: req.params.name })
      .populate("itemsId")
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
  static findOneById(req, res) {
    Category.find({ _id: ObjectId(req.params.id) })
      .populate("itemsId")
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
    const newCategory = new Category ({
      name: inp.name,
      itemsId: []
    })

    newCategory.save()
      .then(data => {
        console.log(data)
        res.json({
          message: "Success",
          data: data
        })
      })
      .catch(err => {
        res.json(err)
      })
  }

  // U1
  static update(req, res) {
    Category.update(
        { _id: ObjectId(req.params.id) },
        { $set: req.body },
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
    Category.deleteOne({ _id: ObjectId(req.params.id) },
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

}

module.exports = ItemController