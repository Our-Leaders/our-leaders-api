const Logger = require('../config/Logger');

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err;
  Logger.log(`Error:${message}`);
  res.status(statusCode||500).json({
    status: "error",
    statusCode: statusCode||500,
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError
};
