const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Types.ObjectId,
  },
  restId: {
    type: mongoose.Types.ObjectId,
  },
  quantity: {
    type: Number,
    // required: true,
    min: [1, 'Quantity can not be less then 1.'],
    deafult: 1,
  },
  bill: {
    type: Number,
    // required: true,
    default: 0,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: [true],
    ref: 'User',
  },
  items: [itemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
