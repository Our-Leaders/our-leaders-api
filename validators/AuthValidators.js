/**
 * Created by bolorundurowb on 11/11/2019
 */

class AuthValidators {
  static validateSignUp(req, res, next) {
    const body = req.body;
    let message = '';

    // check for an email address
    if (body.email) {
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
}

module.exports = AuthValidators;
