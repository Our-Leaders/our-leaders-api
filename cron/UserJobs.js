/**
 * Created by bolor on 5/26/2020
 */

const db = require('./../models');
const Logger = require('./../config/Logger');

class UserJobs {
  static async run() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const eligibleUsers = await db.User
      .find({
        isDeleted: true,
        lastActiveAt: {
          $gte: thirtyDaysAgo
        }
      })
      .select('_id email');

    for (let eligibleUser of eligibleUsers) {
      // remove the user subscriptions
      await db.Subscription
        .deleteMany({
          email: eligibleUser.email
        });

      // remove user account
      await db.User
        .deleteOne({
          _id: eligibleUser._id
        });
    }

    Logger.log('Stale user account cleanup completed at ' + new Date());
  }
}

module.exports = UserJobs;
