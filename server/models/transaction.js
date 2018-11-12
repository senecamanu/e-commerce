const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const userSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  itemsId: [
    {
      itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
      amount: Number
    }
  ],
  totalPrice: Number,
  purchaseDate: Date
});

const Transaction = mongoose.model('Transaction', userSchema);

module.exports = Transaction