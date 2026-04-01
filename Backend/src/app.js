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





app.use(express.json());
app.use(cookieParser());


// Allow your frontend origin
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/api/auth',authRoutes);
app.use('/api/keys',apiKeyRoutes);
app.use('/api/analytics',analyticsRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/gateway',gatewayRoutes);


app.use(errorHandler);
module.exports = app;