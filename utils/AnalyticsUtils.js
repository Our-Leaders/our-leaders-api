/**
 * Created by bolor on 7/10/2020
 */

const moment = require('moment');
const db = require('./../models');
const StringUtil = require('./../utils/StringUtil');

class AnalyticsUtils {
  static async getLocationAnalytics(limit = null) {
    const start = moment().startOf('day').toDate();
    const end = moment().endOf('day').toDate();

    const pipeline = [
      {$match: {timestamp: {$gte: start, $lte: end}}},
      {$group: {_id: {city: '$origin.city', country:'$origin.country'}, visitors: {$sum: 1}, longitude: {$first: '$origin.longitude'}, latitude: {$first: '$origin.latitude'}}},
      // {$group: {_id: '$origin', visitors: {$sum: 1}}},
      {$sort: {visitors: -1}}
    ];

    if (limit) {
      pipeline.push({$limit: limit});
    }

    const results = await db.Statistics
      .aggregate(pipeline);

    return results.map((x, index) => {
      const v = x._id ? `${x._id.city}_${x._id.country}_${x._id.longitude}_${x._id.latitude}` : 'not_available';
      const id = StringUtil.btoa(v);
      return {
        city: x._id ? x._id.city : 'not available',
        country: x._id ? x._id.country : 'not available',
        longitude: x._id ? x.longitude : 'not available',
        latitude: x._id ? x.latitude : 'not available',
        rank: index + 1,
        visitors: x.visitors,
        id
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
