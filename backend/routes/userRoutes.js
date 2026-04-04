const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.use(rateLimiter);

// Public
router.post('/register', controller.addUser);
router.post('/login', controller.loginUser);
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  res.json({ message: 'Logged out successfully' });
});

// Protected
router.get('/me', authenticate, (req, res) => {
  res.json({ id: req.user.sub, email: req.user.email });
});
router.get('/all', authenticate, controller.getUsers);
router.post('/all', authenticate, controller.getUsersByQuery);
router.get('/get/:id', authenticate, controller.getUser);
router.put('/update', authenticate, controller.updateUser);
router.put('/update/login', authenticate, controller.updateUserLogin);
router.delete('/delete/:id', authenticate, controller.deleteUser);

module.exports = router;
