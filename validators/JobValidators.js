/**
 * Created by bolorundurowb on 14/11/2019
 */

const {ErrorHandler} = require('../utils/ErrorUtil');

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
}

module.exports = JobValidators;
