const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
const PORT = process.env.PORT || 8000;

const restaurantsRoutes = require('./routes/restaurantsRoutes');
const usersRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const itemRoutes = require('./routes/itemRoutes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/api/v1/restaurants', restaurantsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/items', itemRoutes);

// app.all('*', (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on the server`,
//   });
// });

// Handling Unhandled Routes
app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('Database Connection Successfully..');
  })
  .catch((err) => {
    console.log('Database Connection Failed');
  });

app.listen(PORT, () => {
  console.log(`🚀🤣Server listening at port http://localhost:${PORT}/api/v1`);
});
