/**
 * Created by bolorundurowb on 11/11/2019
 */

 const StringUtil = require('./../utils/StringUtil');

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
      return res.status(400).send({
        message
      });
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
      return res.status(400).send({
        message
      });
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
      return res.status(400).send({
        message
      });
    } else {
      next();
    }
  }
}

module.exports = AuthValidators;
