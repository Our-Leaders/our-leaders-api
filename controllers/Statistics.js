/**
 * Created by bolorundurowb on 14/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Statistics {
  static async getStats(req, res, next) {
    try {

    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Statistics;
