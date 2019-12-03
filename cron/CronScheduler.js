/**
 * Created by bolorundurowb on 28/11/2019
 */

const nodeCron = require('node-cron');
const FeedsJob = require('./FeedJobs');
const Logger = require('./../config/Logger');

class CronScheduler {
  static startJobs() {
    // run every two hours
    nodeCron.schedule('0 */2 * * *', FeedsJob.run);

    Logger.log('Cron jobs started successfully.');
  }
}

module.exports = CronScheduler;
