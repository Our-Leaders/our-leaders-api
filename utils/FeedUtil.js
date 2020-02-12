/**
 * Created by bolorundurowb on 04/12/2019
 */

const db = require('./../models');

class FeedUtil {
  static async queryFeeds(politicianIds, optionalQuery = null) {
    const aggregatePipeline = [
      {
        $unwind: '$politicians'
      },
      {
        $match: {
          politicians: {
            $in: politicianIds
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          title: {
            $first: '$title'
          },
          summary: {
            $first: '$summary'
          },
          publishedAt: {
            $first: '$publishedAt'
          },
          feedUrl: {
            $first: '$feedUrl'
          }
        }
      },
      {
        $sort: {
          publishedAt: -1
        }
      }
    ];

    if (optionalQuery) {
      aggregatePipeline.unshift({
        $match: optionalQuery
      });
    }

    return db.Feed.aggregate(aggregatePipeline);
  }
}

module.exports = FeedUtil;
