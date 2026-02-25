const express = require('express');
const { route } = require('./auth.routes');
const {registerApiKey} = require('../controllers/apiKey.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();



router.post('/register',authMiddleware,registerApiKey);


module.exports = router;