/**
 * Created by bolorundurowb on 04/12/2019
 */

const db = require('./../models');

class FeedUtil {
  static async queryFeeds(politicianIds, optionalQuery = null) {
    const aggregatePipeline = [
      {
        $unwind: '$politicians'
      }, {
        $match: {
          politicians: {
            $in: politicianIds
          }
        }
      }, {
        $group: {
          _id: '$_id',
          politicians: {
            $addToSet: '$politicians'
          }
        }
      }, {
        $project: {
          _id: 1,
          title: 1,
          summary: 1,
          publishedAt: 1,
          politicians: 1
        }
      }
    ];

    if (optionalQuery) {
      aggregatePipeline.unshift({
        $match: optionalQuery
      });
    }

    const response = await db.Feed.aggregate(aggregatePipeline);

    if (!response.result) {
      return [];
    }

    return response.result;
  }
}

module.exports = FeedUtil;
