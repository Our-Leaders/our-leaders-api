const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const { ErrorHandler } = require('./../utils/errorUtil');

class Politician {
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
      })
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
