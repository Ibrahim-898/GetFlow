const express = require('express');
const ClientUserAuthController = require('../controllers/clientUserAuth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const verifyApiKey = require('../middlewares/verifyApiKey.middleware');
const rateLimitMiddleware = require('../middlewares/rateLimiter.middleware');
const loggerMiddleware = require('../middlewares/logger.middleware');


const router = express.Router();

router.use(verifyApiKey);


router.post('/register',rateLimitMiddleware,loggerMiddleware,ClientUserAuthController.registerClientUser);
router.post('/login',rateLimitMiddleware,loggerMiddleware,ClientUserAuthController.loginClientUser);
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

router.post('/forget-password',rateLimitMiddleware,loggerMiddleware,ClientUserAuthController.clientUserForgetPassword);
router.post('/update-password',rateLimitMiddleware,loggerMiddleware,ClientUserAuthController.clientUserUpdatePassword);




module.exports = router;