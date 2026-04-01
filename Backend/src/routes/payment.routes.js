const express = require('express');
const router = express.Router();
const  {
  initializePayment,
  success,
  fail,
  cancel,
  ipn
} = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/init',authMiddleware, initializePayment);
router.post('/success', success);
router.post('/fail', fail);
router.post('/cancel', cancel);
router.post('/ipn',ipn);

module.exports = router;