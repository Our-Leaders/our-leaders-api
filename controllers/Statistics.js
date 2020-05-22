/**
 * Created by bolorundurowb on 14/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');
const OutputFormatters = require('../utils/OutputFormatters');

class Statistics {
  static async getStats(req, res, next) {
    try {
      const response = {
        parties: await db.PoliticalParty.count({}),
        admins: await db.User.count({$or: [{role: 'admin'}, {role: 'superadmin'}]}),
        leaders: await db.Politician.count(),
        currentLeaders: await db.Politician.count({status: 'current'}),
        upcomingLeaders: await db.Politician.count({status: 'upcoming'})
      };

      // get the list of sign ups for the day
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date();
      dayEnd.setHours(23, 59, 59, 999);

      const newSignUps = await db.User
        .find({
          createdAt: {
            $gte: dayStart,
            $lte: dayEnd
          }
        })
        .select('email createdAt');

      // format the response
      response.signUps = newSignUps.map(x => OutputFormatters.formatSignup(x));

      res.status(200).send({
        statistics: response
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Statistics;
