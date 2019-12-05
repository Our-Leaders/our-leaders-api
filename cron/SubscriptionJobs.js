/**
 * Created by bolorundurowb on 03/12/2019
 */

const _ = require('lodash');
const db = require('./../models');
const Email = require('./../communications/Email');
const EmailUtil = require('./../utils/EmailUtil');
const FeedUtil = require('./../utils/FeedUtil');
const Logger = require('./../config/Logger');

class SubscriptionJobs {
  static async dispatchDailyFeeds() {
    try {
      await SubscriptionJobs.dispatchFeeds('daily', 1);
    } catch (err) {
      Logger.error(err);
      Logger.error('An error occurred when dispatching daily feeds.')
    }
  }

  static async dispatchWeeklyFeeds() {
    try {
      await SubscriptionJobs.dispatchFeeds('weekly', 7);
    } catch (err) {
      Logger.error(err);
      Logger.error('An error occurred when dispatching weekly feeds.')
    }
  }

  static async dispatchMonthlyFeeds() {
    try {
      await SubscriptionJobs.dispatchFeeds('monthly', 30);
    } catch (err) {
      Logger.error(err);
      Logger.error('An error occurred when dispatching monthly feeds.')
    }
  }

  static async dispatchFeeds(frequency, lengthOfDays) {
    const subscriptions = await db.Subscription
      .find({frequency});

    // if there are no subscriptions stop
    if (subscriptions.length === 0) {
      return;
    }

    // define query variables
    const today = new Date();
    const lowerBound = new Date(today.getFullYear(), today.getMonth(), today.getDate() - lengthOfDays, 12);
    const upperBound = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);

    // group subscriptions by user id
    const subscriptionsByUser = _.groupBy(subscriptions, 'user');

    // iterate over the user subscriptions and get feeds
    for (let userId in subscriptionsByUser) {
      if (subscriptionsByUser.hasOwnProperty(userId)) {
        const user = await db.User
          .findById(userId)
          .select('firstName email');

        if (!user) {
          continue;
        }

        const politicianIds = subscriptionsByUser[userId].map(({politician}) => politician);

        // check for feeds with the politician ids
        const feeds = await FeedUtil.queryFeeds(politicianIds, {
          createdAt: {
            $lte: upperBound,
            $gte: lowerBound
          }
        });

        // if there are no fields then skip
        if (feeds.length === 0) {
          continue;
        }

        // send feed summary to user
        const payload = EmailUtil.getSubscriptionEmail(user.email, user.firstName, feeds);
        await Email.send(payload);
      }
    }
  }
}

module.exports = SubscriptionJobs;
