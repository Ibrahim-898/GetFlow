require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/error.middleware');
const apiKeyRoutes = require('./routes/apiKey.routes');
const rateLimit = require('./middlewares/rateLimiter.middleware')
const logging = require('./middlewares/logger.middleware');
const analyticsRoutes = require('./routes/analytics.routes');
const gatewayRoutes = require('./routes/gateway.routes');
const paymentRoutes = require('./routes/payment.routes');
const cors = require('cors');
const app = express();




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use('/api/auth',authRoutes);
app.use('/api/keys',apiKeyRoutes);
app.use('/api/analytics',analyticsRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/gateway',gatewayRoutes);


app.use(errorHandler);
module.exports = app;