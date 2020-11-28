/**
 * Created by bolorundurowb on 28/11/2019
 */

const axios = require('axios');
const $ = require('cheerio');

const db = require('./../models');
const Config = require('./../config/Config');
const Logger = require('./../config/Logger');

class FeedJobs {
  static async run() {
    try {
      const response = await axios.get(Config.feedUrl);
      const newsItems = $('article', response.data);

      // cache a list of the politicians and their ids
      const politicians = await db.Politician
        .find({})
        .select('_id name');

      for (let x = 0; x < newsItems.length; x++) {
        const newsItemHtml = $(newsItems[x]).html();
        const itemHeader = $('.jeg_postblock_content > h3 > a', newsItemHtml);
        const itemTitle = itemHeader.text();
        const itemUrl = itemHeader.attr('href');
        const itemSummary = $('.jeg_post_excerpt > p', newsItemHtml).text();
        const itemDate = $('.jeg_meta_date > a', newsItemHtml).text();

        // check to see if entry exists
        let feed = await db.Feed.findOne({
          feedUrl: itemUrl
        });

        // if feed exists, then skip
        if (feed) {
          continue;
        }

        feed = new db.Feed({
          title: itemTitle,
          feedUrl: itemUrl,
          publishedAt: new Date(itemDate),
          summary: itemSummary,
          politicians: []
        });

        // NOTE: I am not sure this is the most efficient way to go about this
        // check to see if any politician is mentioned in the title or summary
        for (const politician of politicians) {
          const politicianLowerCaseName = politician.name.toLocaleLowerCase();
          const nameArray = politicianLowerCaseName.split(' ');
          for (const name of nameArray) {
            if (feed.title.toLocaleLowerCase().includes(name) ||
              feed.summary.toLocaleLowerCase().includes(name)) {
              feed.politicians.push(politician._id);
              break;
            }
          }
        }

        // if no politician was tracked then ignore feed item
        if (feed.politicians.length > 0) {
          await feed.save();
        }
      }

      Logger.log('Feed synchronization completed at ' + new Date());
    } catch (err) {
      Logger.error(err);
      Logger.error('An error occurred when refreshing feeds.')
    }
  }
}

module.exports = FeedJobs;
