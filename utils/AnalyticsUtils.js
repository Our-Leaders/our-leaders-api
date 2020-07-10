/**
 * Created by bolor on 7/10/2020
 */

class AnalyticsUtils {
  static async getLocationAnalytics(optionalQuery) {
    const pipeline = [
      {$group: {_id: '$origin', visitors: {$sum: 1}}},
      {$sort: {visitors: -1}}
    ];

    if (optionalQuery) {
      pipeline.push(optionalQuery);
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
}

module.exports = AnalyticsUtils;
