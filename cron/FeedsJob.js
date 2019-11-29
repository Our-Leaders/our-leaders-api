/**
 * Created by bolorundurowb on 28/11/2019
 */

const axios = require('axios');
const $ = require('cheerio');

const db = require('./../models');
const Config = require('./../config/Config');
const Logger = require('./../config/Logger');

class FeedsJob {
  static async run() {
    try {
      const response = await axios.get(Config.feedUrl);
      const newsItems = $('.td-ss-main-content > div > div.item-details', response.data);

      for (let x = 0; x < newsItems.length; x++) {
        const newsItemHtml = $(newsItems[x]).html();
        const itemLink = $('h3 > a', newsItemHtml)[0];
        const itemSummary = $('.td-excerpt', newsItemHtml).text();
        const itemDate = $('.td-post-date > time', newsItemHtml).text();

        const feed = new db.Feed({
          title: $(itemLink).text(),
          feedUrl: itemLink.attribs.href,
          publishedAt: new Date(itemDate),
          summary: itemSummary
        });

        // check to see if entry exists
        const existingFeed = await db.Feed.findOne({
          title: feed.title,
          publishedAt: feed.publishedAt
        });

        // if no existing feed item exists then add one
        if (!existingFeed) {
          await feed.save();
        }
      }
    } catch (err) {
      Logger.error(err);
      Logger.error('An error occurred when refreshing feeds.')
    }
  }
}

module.exports = FeedsJob;
