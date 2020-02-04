const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Politician {
  static async addAccomplishment(req, res, next) {
    const {body, params} = req;
    const {id} = params;
    let image = {publicId: null, url: null};

    try {
      const politician = await db.Politician.findById(id);

      if (!politician) {
        next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }

      if (!politician.accomplishments) {
        politician.accomplishments = [];
      }

      if (body.image) {
        image = body.image;
      }

      politician.accomplishments.push({
        title: body.title,
        description: body.description,
        year: body.year,
        quarter: body.quarter,
        image: image,
        tags: body.tags
      });

      await politician.save();

      res.status(200).send({
        politician: OutputFormatters.formatPolitician(politician)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async addEducationalBackground(req, res, next) {
    const {body, params} = req;
    const {id} = params;

    try {
      const politician = await db.Politician.findById(id);

      if (!politician) {
        next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }

      if (!politician.educationalBackground) {
        politician.educationalBackground = [];
      }

      politician.educationalBackground.push({
        degree: body.degree,
        institution: body.institution,
        startDate: body.startDate,
      });

      await politician.save();

      res.status(200).send({
        politician: OutputFormatters.formatPolitician(politician)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async addVote(req, res, next) {
    const {body, params} = req;
    const {id} = params;

    try {
      const politician = await db.Politician.findById(id);

      if (!politician) {
        next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }

      if (!politician.voters) {
        politician.voters = [];
      }

      const index = politician.voters.findIndex(x => x.id === req.user.id);

      if (index > -1) {
        if (politician.voters[index].isUpvote && !body.isUpvote) {
          politician.vote.up--;
          politician.vote.down++;
        }

        if (!politician.voters[index].isUpvote && body.isUpvote) {
          politician.vote.down--;
          politician.vote.up++;
        }
      } else {
        politician.voters.push({
          id: req.user.id,
          isUpvote: body.isUpvote
        });
        if (isUpvote) {
          politician.vote.up++;
        } else {
          politician.vote.down++;
        }
      }

      await politician.save();

      res.status(200).send({
        politician: OutputFormatters.formatPolitician(politician)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async addPoliticalBackground(req, res, next) {
    const {body, params} = req;
    const {id} = params;

    try {
      const politician = await db.Politician.findById(id);

      if (!politician) {
        next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }

      if (!politician.politicalBackground) {
        politician.politicalBackground = [];
      }

      politician.politicalBackground.push({
        position: body.position,
        description: body.description,
        inOffice: body.inOffice,
        state: body.state,
        startDate: body.startDate,
        endDate: body.endDate
      });

      await politician.save();

      res.status(200).send({
        politician: OutputFormatters.formatPolitician(politician)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async create(req, res, next) {
    try {
      const {body} = req;
      let payload = {...body};

      if (body.image) {
        payload = {...payload, profileImage: body.image};
      }

      const politician = new db.Politician(payload);

      ['facebook', 'twitter', 'instagram'].forEach((socialUrl) => {
        if (body[socialUrl]) {
          politician.socials[socialUrl] = body[socialUrl];
        }
      });

      await politician.save();

      res.status(201).send({
        politician: OutputFormatters.formatPolitician(politician)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async find(req, res, next) {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 18; // determined by the mockups
    const {name, status, state, politicalPartyId, politicalPosition} = req.query;
    let findByQuery = {};
    let orQuery = [];

    if (name) {
      orQuery.push({name: {$regex: name, $options: 'i'}});
    }

    if (status) {
      orQuery.push({status: {$regex: status, $options: 'i'}});
    }

    if (state) {
      orQuery.push({state: {$regex: state, $options: 'i'}});
    }

    if (politicalPartyId) {
      orQuery.push({politicalParty: {$regex: politicalPartyId, $options: 'i'}});
    }

    if (politicalPosition) {
      orQuery.push({
        politicalBackground: {
          $elemMatch: {
            inOffice: true,
            position: {$regex: politicalPosition, $options: 'i'}
          }
        }
      });
    }

    // if the search parameters are more than one then use 'or', otherwise use 'where'
    if (orQuery.length > 1) {
      findByQuery = {$or: orQuery};
    } else if (orQuery.length === 1) {
      findByQuery = orQuery[0]
    }

    try {
      const politicians = await db.Politician
        .find(findByQuery)
        .populate('politicalParty')
        .skip(skip)
        .limit(limit)
        .sort({
          name: 'asc'
        });

      const total = await db.Politician.count(findByQuery);
      const serializedPoliticians = politicians.map(politician => {
        return OutputFormatters.formatPolitician(politician);
      });

      res.status(200).send({
        politicians: serializedPoliticians,
        total
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async get(req, res, next) {
    const {params} = req;
    const {id} = params;

    try {
      const politician = await db.Politician.findById(id).populate('politicalParty');

      if (politician) {
        res.status(200).send({
          politician: OutputFormatters.formatPolitician(politician)
        });
      } else {
        next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async addProfessionalBackground(req, res, next) {
    const {body, params} = req;
    const {id} = params;

    try {
      const politician = await db.Politician.findById(id);

      if (!politician) {
        next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }

      // initialize the professional background if none exists
      if (!politician.professionalBackground) {
        politician.professionalBackground = [];
      }

      politician.professionalBackground.push({
        title: body.title,
        description: body.description,
        startDate: body.startDate,
        endDate: body.endDate
      });

      await politician.save();

      res.status(200).send({
        politician: OutputFormatters.formatPolitician(politician)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async edit(req, res, next) {
    const {body, params} = req;
    const {id} = params;

    try {
      const politician = await db.Politician.findById(id);

      if (!politician) {
        next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }

      ['name', 'dob', 'religion', 'manifesto', 'stateOfOrigin', 'politicalParty', 'status'].forEach((property) => {
        if (body[property]) {
          politician[property] = body[property];
        }
      });

      if (body.image) {
        politician.profileImage = body.image;
      }


      if (!politician.socials) {
        politician.socials = {};
      }

      ['facebook', 'twitter', 'instagram'].forEach((socialUrl) => {
        if (body[socialUrl]) {
          politician.socials[socialUrl] = body[socialUrl];
        }
      });

      await politician.save();
      const editedPolitician = await politician.populate('politicalParty').execPopulate();

      res.status(200).send({
        politician: OutputFormatters.formatPolitician(editedPolitician)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async getHighestVotedPoliticians(req, res, next) {
    try {
      const response = {};

      response.current = await db.Politician
        .findOne({status: 'current'})
        .sort('-vote.up');

      response.upcoming = await db.Politician
        .findOne({status: 'upcoming'})
        .sort('-vote.up');

      response.past = await db.Politician
        .findOne({status: 'past'})
        .sort('-vote.up');

      res.status(200).send(response);
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Politician;
