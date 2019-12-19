/**
 * Created by bolorundurowb on 19/12/2019
 */

const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Admins {
  static async createAdmin(req, res, next) {
    try {

    } catch (err) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Admins;
