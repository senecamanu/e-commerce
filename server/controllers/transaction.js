const axios = require("axios"),
  Item = require("../models/item"),
  User = require("../models/user"),
  Transaction = require("../models/transaction"),
  cart = require("../models/cart"),
  Category = require("../models/category"),
  ObjectId = require("mongodb").ObjectId,
  jwt = require("jsonwebtoken"),
  cryptoRandomString = require("crypto-random-string"),
  crypto = require("crypto");

require("dotenv").config();

class TransactionController {

  // C1
  static create(req, res) {
    const inp = req.body
    const header = req.headers.access_token

    console.log(inp)
    console.log(header)

    jwt.verify(header, process.env.JWT_SECRET, (err, decoded) => {
      if (err) res.json(err)
      else {
        // 1. makes a new transaction
        const newTransaction = new Transaction({
          customerId: ObjectId(decoded._id),
          itemsId: inp.itemsId,
          totalPrice: Number(inp.totalPrice),
          purchaseDate: inp.purchaseDate
        })

        newTransaction.save()
          .then(result => {
            // 2. removes from cart
            User.updateOne(
              {_id: result.customerId},
              {$set: {cart: []}},
              (err, resultUser)=> {
                if (err) console.log(err)
                else {
                  // 3. reduces each item from DB
                  for (let i = 0; i < result.itemsId.length; i++) {

                    Item.findOne({_id: ObjectId(result.itemsId[i].itemId)})
                      .exec((err, resultItemFind)=> {
                        const stock = Number(resultItemFind.stock) - Number(result.itemsId[i].amount)

                        Item.updateOne(
                          {_id: ObjectId(result.itemsId[i].itemId)},
                          {$set: { stock: stock }},
                          (err, resultItem) => {
                            if (err) console.log(err)
                            else {
                              
                            }
                          }
                        )
                      })
                  }
                  res.json({
                    message: "Success",
                    result: result
                  })
                }
              }
            )
          })
          .catch(err => {
            res.json(err)
          })
      }
    })
  }

}

module.exports = TransactionController