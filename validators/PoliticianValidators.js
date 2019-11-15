const { ErrorHandler } = require('../utils/errorUtil');
const { TypeUtil } = require('../utils/TypeUtil');

class PoliticianValidators {
  static validateCreation(req, res, next) {
    const body = req.body;
    let message = '';

    if (!body.name) {
      message = 'The political party name is required.';
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

  static validateAccomplishmentsCreation(req, res, next) {
    const body = req.body;
    let message = '';

    if (!body.title) {
      message = 'The title of the accomplishment is required.';
    } else if (!body.description) {
      message = 'The description of the accomplishment is required.';
    } else if (!body.year) {
      message = 'The year of the accomplishment is required.';
    } else if (!body.quarter) {
      message = 'The quarter of the year of the accomplishment is required.';
    } else if (!body.tags || body.tags.length === 0) {
      message = 'The accomplishment requires a minimum of 1 tag.';
    } else if (req.file && (TypeUtil.isNumber(body.width) || TypeUtil.isNumber(body.height))) {
      message = 'Image must have height and width provided.';
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validateEducationalBackgroundCreation(req, res, next) {
    const body = req.body;
    let message = '';

    if (!body.degree) {
      message = 'The degree for the educational background is required.';
    } else if (!body.institution) {
      message = 'The institution for the educational background is required.';
    } else if (!body.startDate) {
      message = 'The start date for the educational background is required.';
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validateVotes(req, res, next) {
    const body = req.body;
    let message = '';

    if (TypeUtil.isBoolean(body.isUpVote)) {
      message = 'A vote is required.';
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }
}

module.exports = PoliticianValidators;
