const mongoose = require('mongoose');

const restaurantAddessSchema = new mongoose.Schema({
  area: {
    type: String,
    // required: true,
  },
  areaPostalCode: {
    type: Number,
    default: 0,
  },
  areaSlug: String,
  country: {
    type: String,
  },
  state: String,
  city: {
    type: String,
    // required: true,
    default: null,
  },
  latLong: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
  locality: {
    type: String,
    // required: true,
  },
});

restaurantAddessSchema.index({ latLong: '2dsphere' });

const slugInfoSchema = new mongoose.Schema({
  slaString: {
    type: String,
  },
  lastMileTravel: {
    type: Number,
  },
  lastMileTravelString: {
    type: String,
  },
  deliveryTime: Number,
  maxDeliveryTime: Number,
  minDeliveryTime: Number,
  thirtyMinOrFree: {
    type: Boolean,
    default: false,
  },
  unserviceable: {
    type: Boolean,
    default: false,
  },
  serviceability: {
    type: String,
    default: 'SERVICEABLE',
  },
  // availability: {
  //   nextCloseTime: "2021-04-12 23:59:00",
  //   visibility: true,
  //   opened: true,
  // },
});

const restaurantSlugSchema = new mongoose.Schema({
  city: String,
  restaurant: String,
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: String,
  isVeg: {
    type: Boolean,
    default: true,
  },
  restaurantSlug: [restaurantSlugSchema],
  cafe: {
    type: Boolean,
    default: false,
  },
  avgRating: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  costForTwo: {
    type: String,
  },
  costForTwoString: {
    type: String,
  },
  cuisines: {
    type: [String],
    default: [],
  },
  // isNew: {
  //   type: Number,
  //   default: 0,
  // },
  restaurantServiceLine: {
    type: [String],
    default: [],
  },
  slugInfo: [slugInfoSchema],
  address: [restaurantAddessSchema],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
