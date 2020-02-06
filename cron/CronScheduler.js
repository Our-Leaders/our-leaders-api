/**
 * Created by bolorundurowb on 28/11/2019
 */

const nodeCron = require('node-cron');
const FeedsJob = require('./FeedJobs');
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

    Logger.log('Cron jobs started successfully.');
  }
}

module.exports = CronScheduler;
