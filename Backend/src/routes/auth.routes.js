const express = require('express');
const {registerUser,loginUser} = require('../controllers/auth.controller');

const router = express.Router();


router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});


module.exports = router;