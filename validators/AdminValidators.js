/**
 * Created by bolorundurowb on 14/11/2019
 */

const {ErrorHandler} = require('../utils/ErrorUtil');

class AdminValidators {
  static validateCreation(req, res, next) {
    const {firstName, lastName, email, password, phone, permissions} = req.body;
    let message = '';

    if (!firstName) {
      message = 'A first name is required.';
    } else if (!lastName) {
      message = 'A last name is required.'
    } else if (!email) {
      message = 'An email address is required.'
    } else if (!phone) {
      message = 'A phone number is required.'
    } else if (!password) {
      message = 'A password is required.'
    } else if (!permissions) {
      message = 'Admin permissions are required.'
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }
}

module.exports = AdminValidators;
