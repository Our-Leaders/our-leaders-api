const {ErrorHandler} = require('../utils/ErrorUtil');
const TypeUtil = require('./../utils/TypeUtil');
const {PoliticalParty} = require('./../models');

class PoliticianValidators {
  static async validateCreation(req, res, next) {
    const {name, dob, country, stateOfOrigin, status, politicalParty} = req.body;
    let message = '';

    if (!name) {
      message = 'The politican\'s name is required.';
    } else if (!dob) {
      message = 'The politician\'s date of birth is required.';
    } else if (!stateOfOrigin) {
      message = 'The politician\'s state of origin is required.';
    } else if (!status || status.trim().length < 1) {
      message = 'Please enter a valid status for the politician';
    }

    if (politicalParty !== undefined) {
      if (politicalParty.trim().length < 1) {
        message = 'Please enter a valid value for the political party';
      } else {
        // guessing the politicalParty value will be the party id
        const party = await PoliticalParty.findById(politicalParty);

        if (!party) {
          message = 'Political party doesn\'t exist, please enter an existing party';
        }
      }
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
    } else if (!body.date) {
      message = 'The date of the accomplishment is required.';
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

  static validateVotes(req, res, next) {
    const {isUpvote} = req.body;
    let message = '';

    if (!TypeUtil.isBoolean(isUpvote)) {
      message = 'A vote is required.';
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validatePoliticalBackgroundUpsert(req, res, next) {
    const body = req.body;
    let message = '';

    for (let background of body.politicalBackground) {
      if (!background.position) {
        message = 'The position for the political background is required.'
      } else if (!background.description && !background.region) {
        message = 'A description or region is required for the political background.';
      } else if (!(background.inOffice === true || background.inOffice === false)) {
        message = 'The office current status for the political background is required.';
      } else if (!background.startDate) {
        message = 'The start date for the political background is required.';
      } else if (!background.endDate) {
        message = 'The end date for the political background is required.';
      } else if (new Date(background.startDate) >= new Date(background.endDate)) {
        message = 'Start date must be less than end date.';
      }
      if (message) break;
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validateEducationalBackgroundUpsert(req, res, next) {
    const body = req.body;
    let message = '';

    for (let background of body.educationalBackground) {
      if (!background.degree) {
        message = 'The degree for the educational background is required.';
      } else if (!background.institution) {
        message = 'The institution for the educational background is required.';
      } else if (background.graduationYear && background.graduationYear < 1) {
        message = 'The graduation year for the education background is invalid.';
      }

      if (message) break;
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static validateProfessionalBackgroundUpsert(req, res, next) {
    const body = req.body;
    let message = '';

    for (let background of body.professionalBackground) {
      if (!background.title) {
        message = 'The title for the professional background is required.'
      } else if (!background.startDate) {
        message = 'The start date for the professional background is required.';
      } else if (!background.endDate) {
        message = 'The end date for the professional background is required.';
      } else if (new Date(background.startDate) >= new Date(background.endDate)) {
        message = 'The start date must come before the end date.';
      }
      if (message) break;
    }

    if (message) {
      next(new ErrorHandler(400, message));
    } else {
      next();
    }
  }

  static async validatePoliticianUpdate(req, res, next) {
    const {body} = req;
    let message = '';

    if (body.name !== undefined && body.name.trim().length < 1) {
      message = 'Please enter a valid name for the politician';
    } else if (body.dob !== undefined && isNaN(new Date(body.dob).getTime())) {
      message = 'Please enter a valid date of birth for the politician';
    } else if (body.manifesto !== undefined && typeof (body.manifesto) !== 'object' && body.manifesto.summary.trim().length < 1) {
      message = 'Please enter a valid summary for politician manifesto';
    } else if (body.stateOfOrigin !== undefined && body.stateOfOrigin.trim().length < 1) {
      message = 'Please enter a valid state of origin for the politician';
    } else if (body.status !== undefined && body.status.trim().length < 1) {
      message = 'Please enter a valid status for the politician';
    }

    if (body.politicalParty !== undefined) {
      if (body.politicalParty.trim().length < 1) {
        message = 'Please enter a valid value for the political party';
      } else {
        // guessing the politicalParty value will the ID for party
        const politicalParty = await PoliticalParty.findById(body.politicalParty);

        if (!politicalParty) {
          message = 'Political party doesn\'t exist, please enter an existing party';
        }
      }
    }

    if (!message) {
      next();
    } else {
      next(new ErrorHandler(400, message));
    }
  }
}

module.exports = PoliticianValidators;
