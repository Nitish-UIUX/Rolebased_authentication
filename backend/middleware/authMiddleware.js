// // middleware/authMiddleware.js

// const jwt = require('jsonwebtoken');

// // Middleware function to authenticate user
// exports.authenticateUser = (req, res, next) => {
//   // Get token from header
//   const token = req.header('x-auth-token');
//   // Check if token exists
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }
//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// // Middleware function to authorize user
// exports.authorizeUser = (req, res, next) => {
//   // Check if user is admin
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     return res.status(403).json({ message: "Unauthorized" });
//   }
// };


const jwt = require('jsonwebtoken');

// Middleware function to authenticate user
exports.authenticateUser = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Bearer schema
  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware function to authorize user
exports.authorizeUser = (req, res, next) => {
  // Check if user is admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
};
