/**
 * Created by bolorundurowb on 28/11/2019
 */

const Config = require('./../config/Config');
const Logger = require('./../config/Logger');

class FeedsJob {
  static async run() {
    try {

    } catch (err) {
      Logger.error(err);
      Logger.error('An error occurred when refreshing feeds.')
    }
  }
}

module.exports = FeedsJob;
