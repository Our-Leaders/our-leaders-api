/**
 * Created by bolorundurowb on 14/11/2019
 */

class SubscriptionValidators {
  static validateCreation(req, res, next) {
    const {body, user} = req;
    let message = '';

    // if the caller is authenticated then use their email address
    if (user) {
      body.email = user.email;
    }

    if (!body.politicianId) {
      message = 'A politicians id is required.';
    }

    if (!body.email) {
      message = 'An email address is required.';
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

module.exports = SubscriptionValidators;
