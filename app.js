// app.js - This file CONFIGURES our application
// Think of it like setting up the rules and roads in a city

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
// Routes = paths users can visit (like roads in a city)

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

/*
SIMPLE EXPLANATION:
-------------------
1. express.json() - Understands JSON data
2. express.urlencoded() - Understands form data
3. express.static() - Serves CSS/images
4. session() - Remembers who's logged in (like a name tag at an event)
5. EJS - Template engine to create HTML pages
6. Routes - Define what happens when users visit different URLs
7. Error handler - Catches mistakes and shows nice error messages

Think of middleware like checkpoints:
- Every request passes through these checkpoints
- Each checkpoint does a small job
- Then the request continues to the route
*/