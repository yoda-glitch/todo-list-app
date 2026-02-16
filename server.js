// server.js - This file STARTS our application

// Import required packages
const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config(); // Load secret settings from .env file

// Get the port number from environment or use 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

// Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Visit: http://localhost:${PORT}`);
});

