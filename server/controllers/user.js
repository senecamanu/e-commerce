const axios = require('axios'),
  Item = require('../models/item'),
  User = require('../models/user'),
  //  Admin = require('../models/admin'),
  Transaction = require('../models/transaction'),
  cart = require('../models/cart'),
  Category = require('../models/category'),
  ObjectId = require('mongodb').ObjectId,
  jwt = require('jsonwebtoken'),
  cryptoRandomString = require('crypto-random-string'),
  crypto = require('crypto')

require('dotenv').config()

const MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  url = 'mongodb://localhost:27017',
  dbName = 'maso',
  client = new MongoClient(url);

class UserController {

  // R1
  static findAll(req, res) {
    User.find({})
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
    User.find({ category: req.params.itemCategory })
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
    User.find({ _id: ObjectId(req.params.id) })
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

  // R4
  static signIn(req, res) {
    const inp = req.body
    User.find({ email: inp.email })
      .exec((err, result) => {
        console.log(`ini result: `, result)
        // 1. Error
        if (err) res.status(500).json({ message: "Error", error: err });
        else {
          if (result.length < 1) {
            // 2. User not found
            res.json({
              message: "User not found",
              data: result
            })
          } else {
            const salt = result[0].salt,
              hash = crypto.createHmac('sha256', inp.password)
                .update(salt) // ?this is the salt
                .digest('hex');
            
            if (hash === result[0].password) {
              // 3. User found and password match
              res.json({
                message: "Success",
                jwt: jwt.sign(JSON.stringify(result[0]), process.env.JWT_SECRET),
                role: "User"
              })
            } else {
              // 4. User found but password does not match
              res.json({
                message: "Password does not match"
              })
            }
          }
        }
      })
  }

  // R5
  static checkCart(req, res) {
    const header = req.headers.access_token
    jwt.verify(header, process.env.JWT_SECRET, (err, decoded) => {

      User.findOne({_id: ObjectId(decoded._id)})
        .exec((err, result) => {
          let totalAmount = 0
          for (let i = 0; i < result.cart.length; i++) {
            totalAmount += Number(result.cart[i].amount)
          }
          res.json({
            amount: totalAmount
          })
        })
    })
  }

  // R6
  static cartList(req, res) {
    const header = req.headers.access_token
    jwt.verify(header, process.env.JWT_SECRET, (err, decoded) => {

      User.findOne({ _id: ObjectId(decoded._id) })
        .populate('cart.itemId')
        .exec((err, result) => {
          if (err) res.json(err)
          else {
            res.json({
              cart: result.cart
            })
          }
        })
    })
  }

  // R7
  static signInAdmin(req, res) {
    const inp = req.body
    User.find({ email: inp.email })
      .exec((err, result) => {
        // 1. Error
        console.log(`ini result:`, result)
        if (err) res.status(500).json({ message: "Error", error: err });
        else {
          if (result.length < 1) {
            // 2. User not found
            res.json({
              message: "User not found",
              data: result
            })
          } else {
            const salt = result[0].salt,
              hash = crypto.createHmac('sha256', inp.password)
                .update(salt) // ?this is the salt
                .digest('hex');

            if (hash === result[0].password) {
              // 3. User found and password match
              res.json({
                message: "Success",
                jwt: jwt.sign(JSON.stringify(result[0]), process.env.JWT_SECRET),
                role: "Admin"
              })
            } else {
              // 4. User found but password does not match
              res.json({
                message: "Password does not match"
              })
            }
          }
        }
      })
  }

  // C1
  static create(req, res) {
    const inp = req.body,
      salt = cryptoRandomString(10),
      hash = crypto.createHmac('sha256', inp.password)
        .update(salt) // ?this is the salt
        .digest('hex');

    const newUser = new User({
      name: inp.name,
      role: 'User',
      email: inp.email,
      password: hash,
      salt: salt,
      cart: []
    })

    newUser.save()
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

  // C2
  static createAdmin(req, res) {
    const inp = req.body,
      salt = cryptoRandomString(10),
      hash = crypto
        .createHmac("sha256", inp.password)
        .update(salt) // ?this is the salt
        .digest("hex");

    const newUser = new User({
      name: inp.name,
      role: "Admin",
      email: inp.email,
      password: hash,
      salt: salt,
      cart: []
    });

    newUser
      .save()
      .then(result => {
        console.log(result)
        res.json({ message: "Success", result: result });
      })
      .catch(err => {
        res.json(err);
      });
  }

  // U1
  static update(req, res) {
    const inp = req.body
    User.update(
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

  // U2
  static updateCart(req, res) {
    const inp = req.body;
    const header = req.headers.access_token
    jwt.verify(header, process.env.JWT_SECRET, (err, decoded) => {
      if (err) res.json(err)
      else {
        User.findById(decoded._id, (err, result) => {
          // console.log(result.cart.length)
          let duplicate = false
          for (let i = 0; i < result.cart.length; i++) {
            // 1. if item exists and you're adding
            if (String(result.cart[i].itemId) === String(inp.itemId)) {
              duplicate = true;
            }
          }

          // 2. Adding if item is not there yet
          if (!duplicate) {
            User.updateOne(
              {_id: result._id},
              {$push: { cart: {
                itemId: ObjectId(inp.itemId),
                amount: Number(inp.amount)
              }}},
              (err, result) => {
                if (err) res.json(err), console.log(err)
                else {
                  res.json({
                    message: "Success",
                    data: result
                  })
                }
              }
            )
          } 
          // 2. adding if duplicate is not true (just +1)
          else {
            let cart = result.cart
            for (let i = 0; i < result.cart.length; i++) {
              if (String(result.cart[i].itemId) === String(inp.itemId)) {
                result.cart[i].amount += Number(inp.amount)
              }
            }

            User.updateOne(
              {_id: result._id},
              {$set: { cart: cart}},
              (err, result) => {
                if (err) res.json(err), console.log(err)
                else {
                  res.json({
                    message: "Success",
                    data: result
                  })
                }
              }
            )
          }
        })
      }
    })
  }

  // D1
  static delete(req, res) {
    User.deleteOne({ _id: ObjectId(req.params.id) },
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

module.exports = UserController