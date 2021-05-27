const express = require('express');
const restaurantController = require('../controllers/restaurantsController');
const router = express();

router
  .route('/')
  .get(restaurantController.getAllRestaurants)
  .post(
    restaurantController.uploadRestaurantImage,
    restaurantController.resizeRestaurantImage,
    restaurantController.addRestaurant
  );

router
  .route('/:id')
  .get(restaurantController.getRestaurantDetails)
  .delete(restaurantController.deleteRestaurant)
  .patch(restaurantController.updateRestaurant);

//-------------------
router
  .route('/restaurants-within/:distance/center/:latlng/unit/:unit')
  .get(restaurantController.getRestaurantsWithin);

router
  .route('/restaurantsDistances/:latlng/unit/:unit')
  .get(restaurantController.getRestaurantDistances);
//-------------------

module.exports = router;
