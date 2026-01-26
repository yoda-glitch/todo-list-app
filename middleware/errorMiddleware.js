// middleware/errorMiddleware.js - Handles errors nicely

const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack);

  // Send error response
  res.status(err.status || 500);
  
  res.render('error', {
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;