// server.js - This file STARTS our application
// Think of it like turning on the ignition of a car

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

/*
SIMPLE EXPLANATION:
-------------------
1. Load the app from app.js
2. Connect to the database
3. Start listening on a port (like opening a shop on street number 5000)
4. When someone visits http://localhost:5000, they can use our app

Think of PORT like a door number on a street. 
Port 5000 = Our app's address
*/