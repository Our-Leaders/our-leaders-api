/**
 * Created by bolor on 5/28/2020
 */

const _ = require('lodash');
const db = require('./../models');
const Logger = require('./../config/Logger');

class WeeklyEmailJobs {
  static async run() {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getDate() - 7);

      // pull a list of politicians that have been subscribed to
      const subscriptions = await db.Subscription
        .find({
          type: 'email'
        })
        .select('politician');
      const politicianIds = _.uniq(subscriptions
        .map(x => x.politician));

      // create a map of the latest notifications for each politician
      const politicianNotificationMap = {};
      for (let politicianId of politicianIds) {
        politicianNotificationMap[politicianId] = await db.Notification
          .findOne({
            entityType: 'politician',
            entityId: politicianId,
            createdAt: {
              $gte: startDate,
              $lte: endDate
            }
          });
      }

      // group each users subscriptions
      const results = await db.Subscription
        .aggregate([
          {$match: {type: 'email'}},
          {
            $group: {
              _id: '$email',
              politicians: {$push: '$politician'}
            }
          }
        ]);

      // for each subscription, send an email
      for (let result of results) {
        const emailPayload = {
          email: result._id,
          notifications: result.politicians.map(x => politicianNotificationMap[x])
        };
      }
    } catch (err) {
      Logger.error(err);
      Logger.error('An error occurred when refreshing feeds.')
    }
  }
}

module.exports = WeeklyEmailJobs;
