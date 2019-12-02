/**
 * Created by bolorundurowb on 30/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');
const OutputFormatters = require('./../utils/OutputFormatters');

class Feeds {
  static async getFeeds(req, res, next) {
    const {user} = req;

    try {
      // get politician ids for all user subscription
      const subscriptions = await db.Subscription
        .find({email: user.email})
        .select('politician');

      const politicianIds = subscriptions.map(x => {
        return x.politician;
      });

      // check for feeds with the politician ids
      const feeds = await db.Feed.aggregate([
        {
          $unwind: '$politicians'
        }, {
          $match: {
            politicians: {
              $in: politicianIds
            }
          }
        }, {
          $group: {
            _id: '$_id',
            politicians: {
              $addToSet: '$politicians'
            }
          }
        }, {
          $project: {
            _id: 1,
            title: 1,
            summary: 1,
            publishedAt: 1,
            politicians: 1
          }
        }
      ]);

      // no feeds
      if (!feeds.result) {
        return res.status(200).send({
          feeds: []
        });
      }

      res.status(200).send({
        feeds: feeds.result.map(x => {
          return OutputFormatters.formatFeed(x)
        })
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Feeds;
