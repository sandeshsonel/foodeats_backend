const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .all(authController.protect)
  .get(cartController.getCartItems)
  .post(cartController.addCartItem);

router
  .route('/:itemId')
  .all(authController.protect)
  .patch(cartController.updateCartItem)
  .delete(cartController.deleteCartItem);

// router.route('/:productId').all(authController.protect);
// // .delete(cartController.deleteCartItem);

module.exports = router;
