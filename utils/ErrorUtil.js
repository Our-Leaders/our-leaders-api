const Logger = require('../config/Logger');

class ErrorHandler extends Error {
  constructor(statusCode, message, error) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}

const handleError = (err, res) => {
  const {statusCode, message, error} = err;
  Logger.log(`Error: ${message}`);
  Logger.error(error);

  res.status(statusCode || 500).json({
    status: "error",
    statusCode: statusCode || 500,
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError
};
