// routes/protectedRoute.js

const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeUser } = require('../middleware/authMiddleware');

router.get('/protected', authenticateUser, authorizeUser, (req, res) => {
  // Send all details of the authenticated user in the JSON response
  const user = req.user;
  res.json({ user });
});

module.exports = router;
