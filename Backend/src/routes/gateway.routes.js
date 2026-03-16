const express = require('express');
const rateLimitMiddleware = require('../middlewares/rateLimiter.middleware');
const loggerMiddleware = require('../middlewares/logger.middleware');
const {proxyRequest} = require('../controllers/gateway.controller');
const router = express.Router();


router.all('/{*path}',rateLimitMiddleware,loggerMiddleware,proxyRequest);

module.exports = router;