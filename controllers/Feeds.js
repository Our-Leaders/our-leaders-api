/**
 * Created by bolorundurowb on 30/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');
const OutputFormatters = require('./../utils/OutputFormatters');
const FeedUtil = require('./../utils/FeedUtil');

class Feeds {
  static async getFeeds(req, res, next) {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 10;

    try {
      const feeds = await db.Feed
        .populate('politicians')
        .sort({createdAt: 'desc'})
        .skip(skip)
        .limit(limit);

      res.status(200).send({
        feeds: feeds.map(x => {
          return OutputFormatters.formatFeed(x)
        })
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async getUserFeeds(req, res, next) {
    const {email} = req.user;

    try {
      // get politician ids for all user feed subscriptions
      const subscriptions = await db.Subscription
        .find({
          email,
          type: 'feeds'
        })
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

  static async getPoliticianFeeds(req, res, next) {
    const {politicianId} = req.params;

    try {
      const politicianIds = [politicianId];
      // check for feeds with the politician ids
      const feeds = await FeedUtil
        .queryFeeds(politicianIds);

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
