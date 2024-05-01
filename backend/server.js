// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const protectedRoute = require('./routes/protectedRoute');
const cors = require('cors');



// Load environment variables
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

const app = express();


// Middleware
app.use(express.json());

app.use(cors());


// Connect to MongoDB
  mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log('Error connecting to MongoDB', error.message);
});

// ------------------------------------Routes--------------------------------
app.use('/api/users', userRoutes);

// Protected route
app.use('/api', protectedRoute);


