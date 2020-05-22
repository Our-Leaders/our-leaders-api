/**
 * Created by bolorundurowb on 14/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');
const OutputFormatters = require('./../utils/OutputFormatters');

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
      response.signUps = newSignUps.map(user => {
        return {
          id: user._id,
          email: user.email,
          createdAt: user.createdAt
        };
      });

      res.status(200).send({
        statistics: response
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async getVisitStats(req, res, next) {
    const {startDate, endDate} = req.query;

    try {
      const matchQuery = {};

      if (startDate) {
        matchQuery.createdAt = {
          $gte: new Date(startDate)
        };
      }

      if (endDate) {
        matchQuery.createdAt = {
          $lte: new Date(endDate)
        };
      }

      const visitsByDate = await db.Statistics.aggregate([
        {
          $match: matchQuery
        },
        {
          $group: {
            _id: {
              'year': {'$year': '$createdAt'},
              'month': {'$month': '$createdAt'},
              'day': {'$dayOfMonth': '$createdAt'}
            },
            visits: {$sum: 1}
          }
        }
      ]);

      res.status(200).send({
        stats: visitsByDate.map(x => OutputFormatters.formatVisitStats(x))
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async recordVisitStat(req, res, next) {
    const {referrer, url} = req.body;

    try {
      // if a url is not in the body then ignore
      if (!url) {
        return res.status(200).send({});
      }

      const statistic = new db.Statistics({
        referrer,
        pageUrl: url,
        userIp: req.clientIp
      });
      await statistic.save();

      res.status(201).send({});
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Statistics;
