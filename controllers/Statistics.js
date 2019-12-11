/**
 * Created by bolorundurowb on 14/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Statistics {
  static async getStats(req, res, next) {
    try {
      const response = {
        parties: await db.PoliticalParty.count({}),
        admins: await db.User.count({$or: [{role: 'admin'}, {role: 'superadmin'}]}),
        currentLeaders: await db.Politician.count({status: 'current'}),
        upcomingLeaders: await db.Politician.count({status: 'upcoming'})
      };

      res.status(200).send({
        statistics: response
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Statistics;
