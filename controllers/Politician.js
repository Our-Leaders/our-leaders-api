const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');
const OutputFormatters = require('./../utils/OutputFormatters');
const NotificationUtil = require('./../utils/NotificationUtil');

class Politician {
  static async addAccomplishment(req, res, next) {
    const {body, params, user} = req;
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
        tags: body.tags,
        url: body.url
      });
      await politician.save();

      res.status(200).send({
        politician: OutputFormatters.formatPolitician(politician)
      });

      // add in notification
      await NotificationUtil.createPoliticianNotification(`Accomplishment added for ${politician.name}.`, user.id, politician._id);
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
        } else if (!politician.voters[index].isUpvote && body.isUpvote) {
          politician.vote.down--;
          politician.vote.up++;
        }
        politician.voters[index].isUpvote = body.isUpvote;
      } else {
        politician.voters.push({
          id: req.user.id,
          isUpvote: body.isUpvote
        });
        if (body.isUpvote) {
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

  static async addOrUpdatePoliticalBackground(politician, politicalBackground) {
    for (let background of politicalBackground) {
      if (background._id) {
        await db.Politician.updateOne({ 'politicalBackground._id': background._id },
          { '$set': {
              'politicalBackground.$.position': background.position,
              'politicalBackground.$.description': background.description,
              'politicalBackground.$.inOffice': background.inOffice,
              'politicalBackground.$.region': background.region,
              'politicalBackground.$.startDate': background.startDate,
              'politicalBackground.$.endDate': background.endDate,
            },
          });
      } else {
        politician.politicalBackground.push({
          position: background.position,
          description: background.description,
          inOffice: background.inOffice,
          region: background.region,
          startDate: background.startDate,
          endDate: background.endDate,
        });
      }
    }
  }

  static async addOrUpdateEducationalBackground(politician, educationalBackground) {
    for (let background of educationalBackground) {
      if (background._id) {
        await db.Politician.updateOne({ 'educationalBackground._id': background._id },
          { '$set': {
              'educationalBackground.$.degree': background.degree,
              'educationalBackground.$.institution': background.institution,
              'educationalBackground.$.startDate': background.startDate,
            },
          });
      } else {
        politician.educationalBackground.push({
          degree: background.degree,
          institution: background.institution,
          startDate: background.startDate,
        });
      }
    }
  }

  static async addOrUpdateProfessionalBackground(politician, professionalBackground) {
    for (let background of professionalBackground) {
      if (background._id) {
        await db.Politician.updateOne({ 'professionalBackground._id': background._id },
          { '$set': {
              'professionalBackground.$.title': background.title,
              'professionalBackground.$.description': background.description,
              'professionalBackground.$.startDate': background.startDate,
              'professionalBackground.$.endDate': background.endDate,
            },
          });
      } else {
        politician.professionalBackground.push({
          title: background.title,
          description: background.description,
          startDate: background.startDate,
          endDate: background.endDate,
        });
      }
    }
  }

  static async addOrUpdatePoliticianBackground(req, res, next) {
    const {body, params, user} = req;
    const {id} = params;
    
    try {
      const politician = await db.Politician.findById(id);

      if (!politician) {
        next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }

      await Politician.addOrUpdatePoliticalBackground(politician, body.politicalBackground);
      await Politician.addOrUpdateEducationalBackground(politician, body.educationalBackground);
      await Politician.addOrUpdateProfessionalBackground(politician, body.professionalBackground);
      await politician.save();

      res.status(200).send({
        politician: OutputFormatters.formatPolitician(politician)
      });

      await NotificationUtil.createPoliticianNotification(`Background updated for ${politician.name}.`, user.id, politician._id);
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async create(req, res, next) {
    try {
      const {body} = req;
      let payload = {...body};

      if (payload.country) {
        payload.country = payload.country.toUpperCase();
      }

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
    const {name, status, country, region, politicalPartyId, politicalPosition} = req.query;
    let findByQuery = {};
    let orQuery = [];

    if (country) {
      findByQuery.country = country.toUpperCase();
    }

    if (name) {
      orQuery.push({name: {$regex: name, $options: 'i'}});
    }

    if (status) {
      orQuery.push({status: {$regex: status, $options: 'i'}});
    }

    if (region) {
      orQuery.push({region: {$regex: region, $options: 'i'}});
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
    if (orQuery.length > 0) {
      // if there is only one optional query, mongo errors out
      if (orQuery.length === 1) {
        Object.assign(findByQuery, orQuery[0]);
      } else {
        findByQuery = {$or: orQuery};
      }
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

      res.status(200).send({
        politicians: politicians.map(x => {
          return OutputFormatters.formatPolitician(x);
        }),
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
      // increment number of views
      politician.numberOfViews++;
      await politician.save();

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

  static async edit(req, res, next) {
    const {body, params, user} = req;
    const {id} = params;

    try {
      const politician = await db.Politician.findById(id);

      if (!politician) {
        return next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }

      for (const property of ['name', 'dob', 'religion', 'manifesto', 'stateOfOrigin']) {
        if (body[property]) {
          politician[property] = body[property];
        }
      }

      // if the status changes, then trigger a notification
      if (body.status && body.status !== politician.status) {
        await NotificationUtil.createPoliticianNotification(`${politician.name} status changed from '${politician.status}' to '${body.status}.`, user.id, politician._id);

        // update the politician
        politician.status = body.status;
      }

      // if the politicians party changes, then trigger a notification
      if (body.politicalParty && body.politicalParty !== politician.politicalParty) {
        const party = await db.PoliticalParty.findById(body.politicalParty);

        if (!party) {
          return next(new ErrorHandler(404, 'The specified political party does not exist.'));
        }

        await NotificationUtil.createPoliticianNotification(`${politician.name} has decamped to ${party.name}.`, user.id, politician._id);

        // update the politician
        politician.politicalParty = body.politicalParty;
      }

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

      const current = await db.Politician
        .find({status: 'current'})
        .populate('politicalParty')
        .sort('-vote.up');

      const upcoming = await db.Politician
        .find({status: 'upcoming'})
        .populate('politicalParty')
        .sort('-vote.up');

      const past = await db.Politician
        .find({status: 'past'})
        .populate('politicalParty')
        .sort('-vote.up');

      response.current = current.map(politician => OutputFormatters.formatPolitician(politician));
      response.upcoming = upcoming.map(politician => OutputFormatters.formatPolitician(politician));
      response.past = past.map(politician => OutputFormatters.formatPolitician(politician));

      res.status(200).send(response);
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Politician;
