const db = require('./../models');

class Politician {
  static async find(req, res, next) {
    try {
      const politicians = await db.Politician.find();
      res.status(200).send({
        politicians
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Politician;
