/**
 * Created by bolorundurowb on 14/11/2019
 */

const _ = require('lodash');
const moment = require('moment');
const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');
const OutputFormatters = require('./../utils/OutputFormatters');
const GeoCodingUtil = require('./../utils/GeoCodingUtils');

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

  static async getVisitStats(req, res, next) {
    const {startDate, endDate} = req.query;
    let dayDiff = 30;
    const result = {};

    if (startDate && endDate) {
      dayDiff = ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    try {
      const matchQuery = {};

      if (startDate) {
        matchQuery.createdAt = {
          $gte: new Date(startDate)
        };
      }

      if (endDate) {
        matchQuery.createdAt = {
          ...matchQuery.createdAt,
          $lte: new Date(endDate)
        };
      }

      for (let i = 0; i < dayDiff; i++) {
        const day = new Date(new Date(startDate).getTime() + (i * 24 * 60 * 60 * 1000));
        result[day] = 0;
      }

      const visitsByDate = await db.Statistics
        .aggregate([
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

      const formattedVisits = visitsByDate.map(x => OutputFormatters.formatVisitStats(x));
      formattedVisits.forEach(x => result[x.date] = x.visits);
      const payload = Object.keys(result).map(x => ({date: new Date(x), visits: result[x]}))

      res.status(200).send({
        visits: payload
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async getSignupStats(req, res, next) {
    const {startDate, endDate} = req.query;
    let dayDiff = 30;
    const result = {};

    if (startDate && endDate) {
      dayDiff = ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    try {
      const matchQuery = {};

      if (startDate) {
        matchQuery.createdAt = {
          $gte: new Date(startDate)
        };
      }

      if (endDate) {
        matchQuery.createdAt = {
          ...matchQuery.createdAt,
          $lte: new Date(endDate)
        };
      }

      for (let i = 0; i < dayDiff; i++) {
        const day = new Date(new Date(startDate).getTime() + (i * 24 * 60 * 60 * 1000));
        result[day] = 0;
      }

      const signUpsByDate = await db.User
        .aggregate([
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
              signUps: {$sum: 1}
            }
          }
        ]);

      const formattedSignups = signUpsByDate.map(x => OutputFormatters.formatSignupStats(x))
      formattedSignups.forEach(x => result[x.date] = x.signUps);
      const payload = Object.keys(result)
        .map(x => ({date: new Date(x), signUps: result[x]}));

      res.status(200).send({
        signUps: payload
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

      const location = await GeoCodingUtil.getLocationFromIp(req.clientIp);
      const statistic = new db.Statistics({
        referrer,
        pageUrl: url,
        userIp: req.clientIp,
        origin: location || 'Unknown'
      });
      await statistic.save();

      res.status(201).send({});
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async getDonations(req, res, next) {
    const {startDate, endDate} = req.query;

    const matchQuery = {};

    if (startDate) {
      matchQuery.date = {
        $gte: new Date(startDate)
      };
    }

    if (endDate) {
      matchQuery.date = {
        ...matchQuery.date,
        $lte: new Date(endDate)
      };
    }

    try {
      const donations = await db.Donation
        .find(matchQuery)
        .sort({
          date: 'asc'
        });

      res.status(200).send({
        donations: donations.map(x => OutputFormatters.formatDonations(x)),
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async getDonationPlotStats(req, res, next) {
    const {startDate, endDate} = req.query;
    let dayDiff = 30;
    const result = [];

    if (startDate && endDate) {
      dayDiff = moment(endDate).diff(moment(startDate), 'day');
    }

    try {
      const matchQuery = {};

      if (startDate) {
        matchQuery.date = {
          $gte: new Date(startDate)
        };
      }

      if (endDate) {
        matchQuery.date = {
          ...matchQuery.date,
          $lte: new Date(endDate)
        };
      }

      for (let i = 0; i < dayDiff; i++) {
        const day = moment(startDate).add(i, 'day').toDate();
        result[day] = 0;
      }

      const aggregateResult = await db.Donation.aggregate(
        [
          {
            $match: matchQuery,
          },
          {
            $group: {
              _id: {
                'year': {'$year': '$date'},
                'month': {'$month': '$date'},
                'day': {'$dayOfMonth': '$date'},
                'currency': '$currency'
              },
              // donations: {$sum: '$amount' }
              // doing this because paystack always charges using the kobo/cent value
              // rather than naira/dollar
              donations: {$sum: {$divide: ['$amount', 100]}}
            }
          },
          {
            $group: {
              _id: {
                'currency': '$_id.currency'
              },
              data: {
                $push: {
                  donations: '$donations',
                  'year': '$_id.year',
                  'month': '$_id.month',
                  'day': '$_id.day',
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              currency: '$_id.currency',
              data: {
                $map: {
                  input: '$data',
                  as: "result",
                  in: {
                    $mergeObjects: [
                      {donations: '$$result.donations'},
                      {
                        date: {
                          $dateFromParts: {
                            year: "$$result.year",
                            day: "$$result.day",
                            month: "$$result.month",
                          }
                        },
                      }
                    ]
                  }
                }
              }
            }
          }
        ]
      );

      // fill in the empty dates with zeros
      const payload = aggregateResult.map(datum => {
        const resultToModify = {...result};
        datum.data.forEach(p => {
          resultToModify[p.date] = p.donations
        });

        const dataToReturn = Object.keys(resultToModify).map(a => ({date: new Date(a), donations: resultToModify[a]}))
        return {
          currency: datum.currency,
          data: dataToReturn,
        };
      });

      res.status(200).send({
        donations: payload,
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Statistics;
