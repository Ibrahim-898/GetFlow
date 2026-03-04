const express = require('express');
const {registerApiKey,getApiKey} = require('../controllers/apiKey.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rateLimit = require('../middlewares/rateLimiter.middleware');
const router = express.Router();



router.post('/register',authMiddleware,registerApiKey);
router.get('/',rateLimit,getApiKey);


module.exports = router;