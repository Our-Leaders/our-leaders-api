const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const { ErrorHandler } = require('./../utils/errorUtil');

class Politician {
  static async addAccomplishment(req, res, next) {
    const { body, params } = req;
    const { id } = params;
    let image = { publicId: null, url: null };

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
    const { body, params } = req;
    const { id } = params;

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

  static async addPoliticalBackground(req, res, next) {
    const { body, params } = req;
    const { id } = params;

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
      const politician = new db.Politician(req.body);
      await politician.save();

      res.status(201).send({
        politician: OutputFormatters.formatPolitician(politician)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async find(req, res, next) {
    const query = req.query;
    let findByQuery = {};
    let orQuery = [];

    if (query.name) {
      orQuery.push({ name: { $regex: query.name, $options: 'i' } });
    }

    if (query.status) {
      orQuery.push({ status: { $regex: query.status, $options: 'i' } });
    }

    if (query.state) {
      orQuery.push({ state: { $regex: query.state, $options: 'i' } });
    }

    if (query.politicalPartyId) {
      orQuery.push({ politicalParty: { $regex: query.politicalPartyId, $options: 'i' } });
    }

    if (query.politicalPosition) {
      orQuery.push({
        politicalBackground: {
          $elemMatch: {
            inOffice: true,
            position: { $regex: query.politicalPosition, $options: 'i' }
          }
        }
      });
    }

    if (orQuery.length) {
      findByQuery = { $or: orQuery };
    }

    try {
      const politicians = await db.Politician.find(findByQuery);
      const serializedPoliticians = politicians.map(politician => {
        return OutputFormatters.formatPolitician(politician);
      });
      res.status(200).send({
        politicians: serializedPoliticians
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async get(req, res, next) {
    const { params } = req;
    const { id } = params;

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
}

module.exports = Politician;
