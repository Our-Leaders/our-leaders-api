/**
 * Created by bolorundurowb on 28/11/2019
 */

const nodeCron = require('node-cron');
const UserJobs = require('./UserJobs');
const FeedsJob = require('./FeedJobs');
const WeeklyEmailJobs = require('./WeeklyEmailJobs');
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

    // check for stale accounts everyday
    nodeCron.schedule('0 0 0 * * ?', UserJobs.run, cronOptions);

    // dispatch weekly notifications every sunday by 12 midnight
    nodeCron.schedule('0 0 0 ? * SUN *', WeeklyEmailJobs.run, cronOptions);

    Logger.log('Cron jobs started successfully.');
  }
}

module.exports = CronScheduler;
