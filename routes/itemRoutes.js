const express = require('express');
const itemController = require('../controllers/itemController');
const router = express.Router();

router
  .route('/')
  .get(itemController.getAllItems)
  .post(
    itemController.uploadItemImage,
    itemController.resizeItemImage,
    itemController.addItem
  );

router
  .route('/:restId/itemId/:itemId')
  .patch(itemController.updateItem)
  .delete(itemController.deleteItem);

module.exports = router;
