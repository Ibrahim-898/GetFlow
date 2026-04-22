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
const clientUserAuthRoutes = require('./routes/clientUserAuth.routes');
const cors = require('cors');
const app = express();




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Allow your frontend origin
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use('/api/auth',authRoutes);
app.use('/api/keys',apiKeyRoutes);
app.use('/api/analytics',analyticsRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/gateway',gatewayRoutes);
app.use('/api/user',clientUserAuthRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});


app.use(errorHandler);
module.exports = app;