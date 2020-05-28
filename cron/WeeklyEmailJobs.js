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

      const subscriptions = await db.Subscription
        .find({
          type: 'email'
        })
        .select('politician');
      const politicianIds = _.uniq(subscriptions
        .map(x => x.politician));

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
    } catch (err) {
      Logger.error(err);
      Logger.error('An error occurred when refreshing feeds.')
    }
  }
}

module.exports = WeeklyEmailJobs;
