/**
 * Created by bolorundurowb on 28/11/2019
 */

const nodeCron = require('node-cron');
const FeedsJob = require('./FeedJobs');
const SubscriptionJobs = require('./SubscriptionJobs');
const Logger = require('./../config/Logger');

class CronScheduler {
  static startJobs() {
    // check feeds every two hours
    nodeCron.schedule('0 */2 * * *', FeedsJob.run);

    // send daily subscriptions at 12 PM
    nodeCron.schedule('0 */12 * * *', SubscriptionJobs.dispatchDailyFeeds);

    // send weekly subscriptions at 12 PM every Sat
    nodeCron.schedule('0 0 12 * * SAT', SubscriptionJobs.dispatchWeeklyFeeds);

    // send monthly subscriptions at 12 PM on the last month day
    nodeCron.schedule('0 12 29 * *', SubscriptionJobs.dispatchMonthlyFeeds);

    Logger.log('Cron jobs started successfully.');
  }
}

module.exports = CronScheduler;
