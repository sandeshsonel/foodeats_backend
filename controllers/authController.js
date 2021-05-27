const { promisify } = require('util');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const ObjectId = mongoose.Types.ObjectId;

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  console.log('xoxo', req.body);
  try {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);
    console.log('newUser', newUser);

    res.status(201).json({
      status: '1',
      token,
      data: {
        fullName: newUser.fullname,
        email: newUser.email,
      },
      message: 'User Created Successfully',
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      status: '0',
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: 'failed',
        message: 'Please provide email and password',
      });
    }
    const user = await User.findOne({ email }).select('+password');
    console.log({ user });
    if (!user) {
      return res.status(404).json({
        success: '0',
        message: 'No user found, Please register',
      });
    }

    const correct = user.correctPassword(password, user.password);

    if (!user || !correct) {
      return res.status(401).json({
        success: '0',
        message: 'Incorrect email or password',
      });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      status: '1',
      token,
      data: {
        firstName: user.fullname,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: '0',
      message: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: 'failure',
        message: 'You are not logged in! Please log in to get access.',
      });
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    let user = await User.find(ObjectId(decoded.id));
    req.user = user[0];
    next();
  } catch (err) {
    console.log(err);
  }
};
