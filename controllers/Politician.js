const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');

class Politician {
  static async find(req, res, next) {
    try {
      const politicians = await db.Politician.find();
      const serializedPolitician = politicians.map(politician => {
        return OutputFormatters.formatPolitician(politician);
      })
      res.status(200).send({
        politicians: serializedPolitician
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Politician;
