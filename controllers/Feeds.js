/**
 * Created by bolorundurowb on 30/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');
const OutputFormatters = require('./../utils/OutputFormatters');
const FeedUtil = require('./../utils/FeedUtil');

class Feeds {
  static async getFeeds(req, res, next) {
    const {user} = req;
    const {politicianId} = req.params;

    try {
      // get politician ids for all user subscription
      const subscriptions = await db.Subscription
        .find({email: user.email})
        .select('politician');

      const politicianIds = subscriptions.map(x => {
        return x.politician;
      });

      // check for feeds with the politician ids
      const feeds = await FeedUtil.queryFeeds(politicianIds);

      res.status(200).send({
        feeds: feeds.map(x => {
          return OutputFormatters.formatFeed(x)
        })
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Feeds;
