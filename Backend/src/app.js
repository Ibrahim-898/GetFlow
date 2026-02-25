const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/error.middleware')
const apiKeyRoutes = require('./routes/apiKey.routes')
const app = express();



app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.use('/api/auth',authRoutes);
app.use('/api/keys',apiKeyRoutes);


module.exports = app;