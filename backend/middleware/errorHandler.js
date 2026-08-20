const errorHandler = (err, req, res, next) => {
  console.error("Error caught by global errorHandler:", err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";
  let errors = null;

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = "Validation Failed";
    errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  // Handle Mongoose Duplicate Key Error (e.g. unique email)
  if (err.code && err.code === 11000) {
    statusCode = 400;
    message = "Duplicate Key Error";
    const field = Object.keys(err.keyValue)[0];
    errors = { [field]: `${field} '${err.keyValue[field]}' already exists.` };
  }

  // Handle Mongoose CastError (invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(errors && { details: errors })
  });
};

module.exports = errorHandler;
