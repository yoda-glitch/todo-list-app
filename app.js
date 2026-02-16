// app.js - This file CONFIGURES our application

const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('./config/logger');

// Create the Express app
const app = express();

// ===== MIDDLEWARE SETUP =====
// Middleware = helpers that process requests before they reach your code

// 1. Parse JSON data from requests
app.use(express.json());

// 2. Parse form data (when users submit forms)
app.use(express.urlencoded({ extended: true }));

// 3. Serve static files (CSS, images) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 4. Set up sessions (to remember logged-in users)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000 // Session lasts 24 hours
  }
}));

// 5. Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 6. Make user info available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ===== ROUTES =====
// Routes = paths users can visit 
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Auth routes (signup, login, logout)
app.use('/auth', authRoutes);

// Task routes (create, view, update, delete tasks)
app.use('/tasks', taskRoutes);

// Home route
app.get('/', (req, res) => {
  if (req.session.user) {
    // If logged in, go to tasks
    res.redirect('/tasks');
  } else {
    // If not logged in, go to login page
    res.redirect('/auth/login');
  }
});

// ===== ERROR HANDLING =====
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Export the app so server.js can use it
module.exports = app;

