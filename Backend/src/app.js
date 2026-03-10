const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/error.middleware');
const apiKeyRoutes = require('./routes/apiKey.routes');
const rateLimit = require('./middlewares/rateLimiter.middleware')
const logging = require('./middlewares/logger.middleware');
const analyticsRoutes = require('./routes/analytics.routes');
const app = express();





app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);



app.use('/api/auth',authRoutes);
app.use('/api/keys',apiKeyRoutes);
app.use('/api/analytics',analyticsRoutes);



module.exports = app;