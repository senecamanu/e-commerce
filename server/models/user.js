const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  role: String,
  email: String,
  password: String,
  salt: String,
  cart: [
    {
      itemId: { type: Schema.Types.ObjectId, ref: "Item" },
      amount: Number
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User