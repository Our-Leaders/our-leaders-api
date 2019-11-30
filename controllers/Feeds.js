/**
 * Created by bolorundurowb on 30/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Feeds {
  static async getFeeds(req, res, next) {
    const {user} = req;

    try {
      const subscriptions = await db.Subscription
        .find({email: user.email})
        .select('politician');

      const politicianIds = subscriptions.map(x => {
        return x.politician;
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Feeds;
