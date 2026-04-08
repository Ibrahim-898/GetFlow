const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();


router.get('/logs',authMiddleware,analyticsController.getLogs);

module.exports = router;