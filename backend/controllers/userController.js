// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../middleware/authMiddleware');



// -----------------------rigister user---------------------

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create new user
    user = new User({ username, email, password });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


// -----------------------login user---------------------

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Create JWT token
    const payload = {
      user: {
        username: user.username,
        id: user._id,
        email: user.email,
        role: user.role
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id, email: user.email, username: user.username, role: user.role }, process.env.JWT_REFRESH_SECRET);
   // Omit the password from the user object
   const userWithoutPassword = { ...user._doc, password: undefined };
   res.json({ token, refreshToken, user: userWithoutPassword });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};




// -----------------------refresh token---------------------

exports.refresh = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Bearer schema
    if (!token) {
      return res.status(403).json({ message: "Authorization denied" });
    }
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (error, user) => {
      if (error) {
        return res.status(403).json({ message: "Authorization denied" });
      }
      const payload = {
        user: {
          username: user.username,
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
      const newToken = jwt.sign(payload, process.env.JWT_SECRET);
      res.json({ newToken });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


// -----------------------logout user---------------------

exports.logout = async (req, res) => {
  try {
    // Perform any necessary actions for logout (e.g., token invalidation)
    // For simplicity, let's just send a success message
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


  




