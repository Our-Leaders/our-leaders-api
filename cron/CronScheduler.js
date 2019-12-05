/**
 * Created by bolorundurowb on 28/11/2019
 */

const nodeCron = require('node-cron');
const FeedsJob = require('./FeedJobs');
const SubscriptionJobs = require('./SubscriptionJobs');
const Logger = require('./../config/Logger');

class CronScheduler {
  static startJobs() {
    const cronOptions = {
      scheduled: true,
      // Africa/Lagos is not yet supported but algiers in the same timezone as lagos
      timezone: 'Africa/Algiers'
    };

    // check feeds every two hours
    nodeCron.schedule('0 */2 * * *', FeedsJob.run, cronOptions);

    // send daily subscriptions at 12 PM
    nodeCron.schedule('0 */12 * * *', SubscriptionJobs.dispatchDailyFeeds, cronOptions);

    // send weekly subscriptions at 12 PM every Sat
    nodeCron.schedule('0 0 12 * * SAT', SubscriptionJobs.dispatchWeeklyFeeds, cronOptions);

    // send monthly subscriptions at 12 PM on the 28th day of each month
    nodeCron.schedule('0 12 28 * *', SubscriptionJobs.dispatchMonthlyFeeds, cronOptions);

    Logger.log('Cron jobs started successfully.');
  }
}

module.exports = CronScheduler;
