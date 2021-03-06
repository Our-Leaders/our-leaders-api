/**
 * Created by bolorundurowb on 11/11/2019
 */

const StringUtil = require('./../utils/StringUtil');
const {ErrorHandler} = require('../utils/ErrorUtil');

class AuthValidators {
  static validateSignUp(req, res, next) {
    const body = req.body;
    let message = '';

    // check for an email address
    if (body.email) {
      if (!StringUtil.isValidEmail(body.email)) {
        message = 'A valid email is required.';
      }

      if (!body.password) {
        message = 'A password is required for email sign up.';
      }
    }
    // check for google or facebook id
    else {
      if (!(body.googleId || body.facebookId)) {
        message = 'An id is required for social sign up.';
      }
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validateAdminLogin(req, res, next) {
    const body = req.body;
    let message = '';

    if (!StringUtil.isValidEmail(body.email)) {
      message = 'A valid email is required.';
    } else if (!body.password) {
      message = 'A password is required for email sign up.';
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validateVerificationRequest(req, res, next) {
    const query = req.query;
    let message = '';

    if (!query.phoneNumber || !StringUtil.isOnlyDigits(query.phoneNumber)) {
      message = 'A valid phone number is required.';
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validateVerificationCode(req, res, next) {
    const body = req.body;
    let message = '';

    if (!body.verificationCode) {
      message = 'A verification code is required.';
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validateResetRequest(req, res, next) {
    const {email} = req.body;
    let message = '';

    if (!email) {
      message = 'Please enter a valid email address.';
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validatePasswordReset(req, res, next) {
    const {token, password, confirmPassword} = req.body;
    let message = '';

    if (!token) {
      message = 'A reset token needs to be provided.';
    } else if (!password) {
      message = 'Please enter a password.';
    } else if (!confirmPassword) {
      message = 'Please enter a password confirmation.';
    } else if (password !== confirmPassword) {
      message = 'Your password and the confirmation do not match.';
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }
}

module.exports = AuthValidators;
