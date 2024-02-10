const errorHandlingMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500; // Default to internal server error
  
    // If SequelizeValidationError, extract the error details
    if (err.name === 'SequelizeValidationError') {
      statusCode = 400; // Bad Request
      const errors = err.errors.map((error) => ({
        field: error.path,
        message: error.message,
      }));
      return res.status(statusCode).json({ errors });
    }
    
    // For any other error,  generic error response
    return res.status(statusCode).json({ error: err.message });
  };
  
  module.exports = errorHandlingMiddleware;
  