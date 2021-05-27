const multer = require('multer');
const sharp = require('sharp');
const Item = require('../models/itemModel');

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

exports.uploadItemImage = upload.single('image');

exports.resizeItemImage = (req, res, next) => {
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

exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find();

    res.status(200).json({
      status: 'success',
      result: items.length,
      data: items,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
    });
  }
};

exports.getItem = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.addItem = async (req, res, next) => {
  try {
    console.log('xoxo-additem', req.body);
    const item = await Item.create(req.body);
    res.status(201).json({
      success: '1',
      message: 'Item Add Successfully',
      data: item,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.updateItem = async (req, res, next) => {
  try {
  } catch (error) {}
};
