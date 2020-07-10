/**
 * Created by bolor on 7/10/2020
 */

const moment = require('moment');

class AnalyticsUtils {
  static async getLocationAnalytics(limit = null, date = null) {
    const pipeline = [
      {$group: {_id: '$origin', visitors: {$sum: 1}}},
      {$sort: {visitors: -1}}
    ];

    if (limit) {
      pipeline.push({$limit: limit});
    }

    if (date) {
      const day = moment(date);
      const start = day.startOf('day').toDate();
      const end = day.endOf('day').toDate();
      pipeline.unshift({
        timestamp: {
          $gte: start,
          $lte: end
        }
      });
    }

    const results = await db.Statistics
      .aggregate(pipeline);

    return results.map((x, index) => {
      return {
        name: x._id,
        rank: index + 1,
        visits: x.visits
      }
    });
  }

  static async getPageViewAnalytics(optionalQuery = null) {
    const pipeline = [
      {$group: {_id: '$pageUrl', viewCount: {$sum: 1}}},
      {$sort: {viewCount: -1}}
    ];

    if (optionalQuery) {
      pipeline.push(optionalQuery);
    }

    const results = await db.Statistics
      .aggregate(pipeline);

    return results.map((x, index) => {
      return {
        name: x.pageTitle,
        url: x._id,
        rank: index + 1,
        viewCount: x.viewCount
      }
    });
  }
}

module.exports = AnalyticsUtils;
