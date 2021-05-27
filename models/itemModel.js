const mongoose = require('mongoose');

const variantGroupsSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  group_id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  variations: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      default: {
        type: Number,
        min: 1,
      },
      inStock: {
        type: Number,
        min: 1,
      },
      isVeg: {
        type: Number,
        min: 1,
      },
    },
  ],
});

const itemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Types.ObjectId,
    ref: 'Restaurant',
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: true,
  },
  inStock: {
    type: Number,
    min: 1,
  },
  isPopular: {
    type: Number,
    min: 0,
    max: 1,
    default: 0,
  },
  isVeg: {
    type: Number,
    min: 0,
    max: 1,
  },
  price: {
    type: Number,
    required: [true],
  },
  // variants: [itemVariantsSchema],
});

const Item = mongoose.model('Items', itemSchema);

module.exports = Item;
