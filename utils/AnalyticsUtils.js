/**
 * Created by bolor on 7/10/2020
 */

const moment = require('moment');
const db = require('./../models');

class AnalyticsUtils {
  static async getLocationAnalytics(limit = null) {
    const start = moment().startOf('day').toDate();
    const end = moment().endOf('day').toDate();

    const pipeline = [
      {$match: {timestamp: {$gte: start, $lte: end}}},
      {$group: {_id: '$origin', visitors: {$sum: 1}}},
      {$sort: {visitors: -1}}
    ];

    if (limit) {
      pipeline.push({$limit: limit});
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

  static async getPageViewAnalytics(limit = null) {
    const start = moment().startOf('day').toDate();
    const end = moment().endOf('day').toDate();

    const pipeline = [
      {$match: {timestamp: {$gte: start, $lte: end}}},
      {$group: {_id: '$pageUrl', viewCount: {$sum: 1}, pageTitle: {$first: '$pageTitle'}}},
      {$sort: {viewCount: -1}}
    ];

    if (limit) {
      pipeline.push({$limit: limit});
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
