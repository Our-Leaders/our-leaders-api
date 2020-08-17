/**
 * Created by bolorundurowb on 14/11/2019
 */

const {ErrorHandler} = require('../utils/ErrorUtil');
const StringUtil = require('./../utils/StringUtil');

class JobValidators {
  static validateCreation(req, res, next) {
    const {title, description, applicationLink, category} = req.body;
    let message = '';

    if (!title) {
      message = 'A title is required.';
    } else if (!description) {
      message = 'A description is required.'
    } else if (!applicationLink) {
      message = 'An application link is required.'
    } else if (!category) {
      message = 'A listing category is required.'
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validateJobApplication(req, res, next) {
    const {firstName, lastName, email, address, cv, portfolio, interested, strengths} = req.body;
    let message = '';

    if (!firstName) {
      message = 'A first name is required.';
    } else if (!lastName) {
      message = 'A last name is required.';
    } else if (!address) {
      message = 'An address is required.';
    } else if (!email || !StringUtil.isValidEmail(email)) {
      message = 'A valid email is required.'
    } else if (!cv) {
      message = 'A CV link is required.'
    } else if (!portfolio) {
      message = 'A portfolio is required.'
    } else if (!interested) {
      message = 'Your interests are is required.'
    } else if (!strengths) {
      message = 'Your strengths are is required.'
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }
}

module.exports = JobValidators;
