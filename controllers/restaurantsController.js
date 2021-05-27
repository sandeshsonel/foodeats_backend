const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');
const Restaurants = require('../models/restaurantsModel');

const ObjectId = mongoose.Types.ObjectId;

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadRestaurantImage = upload.single('image');

exports.resizeRestaurantImage = (req, res, next) => {
  try {
    if (!req.file) return next();

    req.file.filename = `${Date.now()}.jpeg`;

    sharp(req.file.buffer)
      .toFormat('jpeg')
      // .resize({ width: 306, height: 235 })
      .jpeg({ quality: 90 })
      .toFile(`uploads/images/restaurant/${req.file.filename}`);

    next();
  } catch (error) {
    console.log(error);
  }
};

exports.getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurants.find();
    console.log('xoxo', restaurants);
    res.status(200).json({
      status: 'success',
      result: restaurants.length,
      data: {
        restaurants,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
    });
  }
};

// /restaurants-distance?distance=233&center=-40,45&unit=mi
// /restaurants-distance/233/center/-40,45/unit=mi
exports.getRestaurantsWithin = async (req, res, next) => {
  try {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    console.log({ radius });

    if (!lat || !lng) {
      return res.status(400).json({
        status: '0',
        message: 'Please provide latitude and logitude in the format lat, lng',
      });
    }

    console.log({ distance, lat, lng, unit });

    const restaurants = await Restaurants.find({
      latLong: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] },
      },
    });

    return res.status(200).json({
      status: '1',
      data: restaurants,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getRestaurantDistances = async (req, res, next) => {
  try {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng) {
      return res.status(400).json({
        status: '0',
        message: 'Please provide latitude and logitude in the format lat, lng',
      });
    }

    console.log(JSON.parse(lat), JSON.parse(lng));

    const restaurants = await Restaurants.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [JSON.parse(lat), JSON.parse(lng)],
            maxDistance: 2,
            // spherical: true,
          },
          distanceField: 'distance',
          // distanceMultiplier: 0.001,
          // spherical: true,
        },
      },
      {
        $project: {
          distance: 1,
          // name: 1,
        },
      },
    ]);

    console.log('xoxo', restaurants);

    return res.status(200).json({
      status: '1',
      data: restaurants,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getRestaurant = async (req, res, next) => {
  try {
    console.log('xoxo', req.params);
    const restaurant = await Restaurants.find({
      'latLong.category': req.params.id,
    });
    console.log('xoxo', restaurant);
  } catch (error) {}
};

exports.getRestaurantDetails = async (req, res, next) => {
  try {
    console.log('xoxo', req.params);

    const restaurant = await Restaurants.aggregate([
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: 'restaurantId',
          as: 'menu',
        },
      },
      {
        $unwind: '$menu',
      },

      {
        $group: {
          _id: '$_id',
          // isVeg: '$isVeg',
          menu: { $push: '$menu' },
          // menu: { $addToSet: '$menu' },
        },
      },

      // {
      //   $addFields: { menu: '$menu' },
      // },
      {
        $project: {
          _id: '$_id',
          rest: '$restaurants',
          menu: '$menu',
          // document: '$$ROOT',
        },
      },
    ]);
    console.log('xoxo-detail', restaurant);

    return res.status(200).json({
      status: '1',
      data: restaurant,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addRestaurant = async (req, res, next) => {
  try {
    console.log('xoxxooxoox', req.body);
    // let itemFileName = req.file ? req.file.filename : null;

    const result = await Restaurants.create(req.body);
    res.status(201).json({
      success: '1',
      message: 'Add Restaurant Successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.deleteRestaurant = async (req, res, next) => {
  try {
    const result = await Restaurants.findByIdAndDelete(req.params.id);
  } catch (error) {}
};

exports.getRestaurantItems = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.getRestaurantItem = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.addRestaurantItem = async (req, res, next) => {
  try {
    // const result = await Restaurants.findByIdAndUpdate(req.params.restaurantId, {$push: {"items": }})
  } catch (error) {}
};

exports.updateRestaurantItem = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.deleteRestaurantItem = async (req, res, next) => {
  try {
  } catch (error) {}
};
