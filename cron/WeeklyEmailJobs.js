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

      // group each users subscriptions
      const userSubscriptions = await db.Subscription
        .aggregate([
          {$match: {type: 'email'}},
          {
            $group: {
              _id: '$email',
              politicians: {$push: '$politician'}
            }
          }
        ]);

      // load user updates and send
      for (let userSubscription of userSubscriptions) {
        const payload = {
          email: userSubscription._id,
          updates: []
        };

        for (let politicianId of userSubscription.politicians) {
          const politician = await db.Politician
            .findById(politicianId);
          const notification = await db.Notification
            .findOne({
              entityType: 'politician',
              entityId: politicianId,
              createdAt: {
                $gte: startDate,
                $lte: endDate
              }
            });

          payload.updates.push({
            politician,
            notification
          });
        }

        // send the update email

      }
    } catch (err) {
      Logger.error(err);
      Logger.error('An error occurred when refreshing feeds.')
    }
  }
}

module.exports = WeeklyEmailJobs;
