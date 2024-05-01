// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authMiddleware');

// User registration route
router.post('/register', userController.register);
// User login route
router.post('/login', userController.login);

// refresh token route
router.post('/refresh', userController.refresh);

// logout route
router.post('/logout', authenticateUser, userController.logout);

module.exports = router;
