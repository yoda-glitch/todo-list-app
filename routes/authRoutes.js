// routes/authRoutes.js - URL paths for authentication

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /auth/register - Show register page
router.get('/register', authController.showRegisterPage);

// POST /auth/register - Register new user
router.post('/register', authController.register);

// GET /auth/login - Show login page
router.get('/login', authController.showLoginPage);

// POST /auth/login - Login user
router.post('/login', authController.login);

// GET /auth/logout - Logout user
router.get('/logout', authController.logout);

module.exports = router;