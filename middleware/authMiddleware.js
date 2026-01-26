// middleware/authMiddleware.js - Checks if user is logged in

const authMiddleware = (req, res, next) => {
  // Check if user session exists
  if (req.session && req.session.user) {
    // User is logged in, continue
    next();
  } else {
    // User is not logged in, redirect to login
    res.redirect('/auth/login');
  }
};

module.exports = authMiddleware;