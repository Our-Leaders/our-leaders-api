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

      // cache a list of the politicians and their ids
      const politicians = await db.Politician
        .find({})
        .select('_id name');

      for (let x = 0; x < newsItems.length; x++) {
        const newsItemHtml = $(newsItems[x]).html();
        const itemLink = $('h3 > a', newsItemHtml)[0];
        const itemSummary = $('.td-excerpt', newsItemHtml).text();
        const itemDate = $('.td-post-date > time', newsItemHtml).text();

        // check to see if entry exists
        let feed = await db.Feed.findOne({
          feedUrl: itemLink.attribs.href
        });

        // if feed exists, then skip
        if (feed) {
          continue;
        }

        feed = new db.Feed({
          title: $(itemLink).text(),
          feedUrl: itemLink.attribs.href,
          publishedAt: new Date(itemDate),
          summary: itemSummary,
          politicians: []
        });

        // NOTE: I am not sure this is the most efficient way to go about this
        // check to see if any politician is mentioned in the title or summary
        for (const politician of politicians) {
          const politicianLowerCaseName = politician.name.toLocaleLowerCase();
          if (feed.title.toLocaleLowerCase().includes(politicianLowerCaseName) ||
            feed.summary.toLocaleLowerCase().includes(politicianLowerCaseName)) {
            feed.politicians.push(politician._id);
          }
        }

        // if no politician was tracked then ignore feed item
        if (feed.politicians.length > 0) {
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
