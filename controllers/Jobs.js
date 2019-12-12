const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const { ErrorHandler } = require('../utils/ErrorUtil');

class Jobs {
  static async addJobListing(req, res, next) {
    const { body } = req;

    try {

    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Jobs;
