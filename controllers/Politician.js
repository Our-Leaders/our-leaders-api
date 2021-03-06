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
        return next(new ErrorHandler(404, 'Politician doesn\'t exist'));
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
        date: body.date,
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

  static async updateAccomplishment(req, res, next) {
    const {body, params, user} = req;
    let image = {publicId: null, url: null};

    try {
      if (body.image) {
        image = body.image;
      }

      const politician = await db.Politician.findOneAndUpdate({'accomplishments._id': params.accomplishmentId}, {
          'accomplishments.$.title': body.title,
          'accomplishments.$.description': body.description,
          'accomplishments.$.date': body.date,
          'accomplishments.$.quarter': body.quarter,
          'accomplishments.$.image': image,
          'accomplishments.$.tags': body.tags,
          'accomplishments.$.url': body.url,
        },
        {new: true, useFindAndModify: false});

      if (!politician) {
        return next(new ErrorHandler(404, 'Accomplishment doesn\'t exist'));
      }

      res.status(200).send({
        politician: OutputFormatters.formatPolitician(politician)
      });

      // add in notification
      await NotificationUtil.createPoliticianNotification(`Accomplishment updated for ${politician.name}.`, user.id, politician._id);
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async deleteAccomplishment(req, res, next) {
    const {params, user} = req;
    const {id, accomplishmentId} = params;

    try {
      const politician = await db.Politician.findById(id);

      if (!politician) {
        return next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }

      const accomplishments = politician.accomplishments.filter(accomplishment => {
        return accomplishment._id !== accomplishmentId;
      });

      politician.accomplishments = accomplishments;
      politician.save();

      res.status(200).send({
        politician: OutputFormatters.formatPolitician(politician)
      });

      // add in notification
      await NotificationUtil.createPoliticianNotification(`Accomplishment deleted for ${politician.name}.`, user.id, politician._id);
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
        return next(new ErrorHandler(404, 'Politician doesn\'t exist'));
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
        await db.Politician.updateOne({'politicalBackground._id': background._id},
          {
            '$set': {
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
      // only set the graduation year when a valid positive value is sent
      const graduationYear = background.graduationYear && background.graduationYear > 0 ? +background.graduationYear : null;

      if (background._id) {
        await db.Politician.updateOne({'educationalBackground._id': background._id},
          {
            '$set': {
              'educationalBackground.$.degree': background.degree,
              'educationalBackground.$.institution': background.institution,
              'educationalBackground.$.graduationYear': graduationYear,
            },
          });
      } else {
        politician.educationalBackground.push({
          degree: background.degree,
          institution: background.institution,
          graduationYear: graduationYear,
        });
      }
    }
  }

  static async addOrUpdateProfessionalBackground(politician, professionalBackground) {
    for (let background of professionalBackground) {
      // only set the start and end year when a valid positive value is sent
      const startYear = background.startYear && background.startYear > 0 ? +background.startYear : null;
      const endYear = background.endYear && background.endYear > 0 ? +background.endYear : null;

      if (background._id) {
        await db.Politician.updateOne({'professionalBackground._id': background._id},
          {
            '$set': {
              'professionalBackground.$.title': background.title,
              'professionalBackground.$.description': background.description,
              'professionalBackground.$.startYear': startYear,
              'professionalBackground.$.endYear': endYear,
            },
          });
      } else {
        politician.professionalBackground.push({
          title: background.title,
          description: background.description,
          startYear: startYear,
          endYear: endYear,
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
    let andQuery = [];

    if (country) {
      findByQuery.country = country.toUpperCase();
    }

    if (name) {
      andQuery.push({name: {$regex: name, $options: 'i'}});
    }

    if (status) {
      andQuery.push({status: {$regex: status, $options: 'i'}});
    }

    if (region) {
      andQuery.push({region: {$regex: region, $options: 'i'}});
    }

    if (politicalPartyId) {
      andQuery.push({politicalParty: {$regex: politicalPartyId, $options: 'i'}});
    }

    if (politicalPosition) {
      andQuery.push({
        politicalBackground: {
          $elemMatch: {
            inOffice: true,
            position: {$regex: politicalPosition, $options: 'i'}
          }
        }
      });
    }

    // if the search parameters are more than one then use 'or', otherwise use 'where'
    if (andQuery.length > 0) {
      // if there is only one optional query, mongo errors out
      if (andQuery.length === 1) {
        Object.assign(findByQuery, andQuery[0]);
      } else {
        Object.assign(findByQuery, {$and: andQuery});
      }
    }

    try {
      const politicians = await db.Politician
        .find(findByQuery)
        .populate('politicalParty')
        .skip(skip * limit)
        .limit(limit)
        .sort({name: 'asc'});

      const total = await db.Politician
        .count(findByQuery);

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

      for (const property of ['name', 'dob', 'manifesto', 'stateOfOrigin']) {
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
        if (body[socialUrl] & !!body[socialUrl]) {
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

  static async delete(req, res, next) {
    const {params} = req;
    const {id} = params;

    try {
      const politician = await db.Politician.findById(id);

      if (!politician) {
        return next(new ErrorHandler(404, 'Politician doesn\'t exist'));
      }

      await politician.remove();

      res.status(200).send({
        message: 'politician deleted succcesfully',
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async getHighestVotedPoliticians(req, res, next) {
    try {
      const status = req.query.status || 'current';

      const response = await db.Politician
        .find({status})
        .populate('politicalParty')
        .sort('-vote.up')
        .limit(9);

      res.status(200).send({ politicians: response.map(politician => OutputFormatters.formatPolitician(politician)) });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Politician;
