const express = require('express');
const {registerUser,loginUser} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();


router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email
  });
});


module.exports = router;