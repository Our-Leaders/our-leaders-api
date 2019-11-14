const { ErrorHandler } = require('../utils/errorUtil');

class PoliticianValidators {
  static validateCreation(req, res, next) {
    const body = req.body;
    let message = '';

    if (!body.name) {
      message = 'The political party name is required.'
    } else if (!body.dob) {
      message = 'The politician date of birth is required.';
    } else if (!body.religious) {
      message = 'The politician religious status is required.';
    } else if (!body.stateOfOrigin) {
      message = 'The politician state of origin is required.';
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }
}

module.exports = PoliticianValidators;
