/**
 * Created by bolorundurowb on 06/11/2019
 */
const winston = require('winston');
const fs = require('fs');

const logDir = './logs';

/* istanbul ignore if  */
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => {
  return (new Date()).toLocaleTimeString();
};

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
);

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      colorize: true,
      timestamp: tsFormat,
      json: false,
      format: alignedWithColorsAndTime
    }),
    new winston.transports.File({
      level: 'error',
      filename: `${logDir}/errors.log`,
      timestamp: tsFormat,
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
      colorize: false
    })
  ],
  exitOnError: false
});

class Logger {
  /**
   * A method to print a message to the console
   * @param {string} message
   */
  static log(message) {
    logger.level = 'info';
    logger.info(message);
  }

  /**
   * A method to log errors to the console
   * @param {Object} err
   */
  static error(err) {
    logger.level = 'error';
    logger.error(`\n\n${err}`);
  }
}

module.exports = Logger;
