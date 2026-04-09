const express = require('express');
const {registerApiKey,getApiKey, getApiKeyStats,updateApiKeyStatus} = require('../controllers/apiKey.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rateLimit = require('../middlewares/rateLimiter.middleware');
const router = express.Router();



router.post('/register',authMiddleware,registerApiKey);

router.get('/',authMiddleware,getApiKey);
router.get('/apiKeystat',authMiddleware,getApiKeyStats);
router.put("/apikey/:keyId/status", authMiddleware, updateApiKeyStatus);


module.exports = router;