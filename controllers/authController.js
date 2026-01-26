// controllers/authController.js - Handles user registration and login

const User = require('../models/User');
const logger = require('../config/logger');

// Show Register Page
exports.showRegisterPage = (req, res) => {
  res.render('register', { error: null });
};

// Show Login Page
exports.showLoginPage = (req, res) => {
  res.render('login', { error: null });
};

// Register New User
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', { error: 'Username already exists' });
    }

    // Create new user
    const user = new User({ username, password });
    await user.save();

    logger.info(`New user registered: ${username}`);
    
    // Redirect to login page
    res.redirect('/auth/login');
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.render('register', { error: 'Registration failed. Please try again.' });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    // Create session
    req.session.user = {
      id: user._id,
      username: user.username
    };

    logger.info(`User logged in: ${username}`);
    
    // Redirect to tasks page
    res.redirect('/tasks');
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.render('login', { error: 'Login failed. Please try again.' });
  }
};

// Logout User
exports.logout = (req, res) => {
  const username = req.session.user?.username;
  
  req.session.destroy((err) => {
    if (err) {
      logger.error(`Logout error: ${err.message}`);
    } else {
      logger.info(`User logged out: ${username}`);
    }
    res.redirect('/auth/login');
  });
};