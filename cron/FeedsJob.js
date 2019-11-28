/**
 * Created by bolorundurowb on 28/11/2019
 */

const axios = require('axios');
const $ = require('cheerio');

const Config = require('./../config/Config');
const Logger = require('./../config/Logger');

class FeedsJob {
  static async run() {
    try {
      const response = await axios.get(Config.feedUrl);
      const newsItems = $('.td-ss-main-content > div > div.item-details', response.data);

      for (let x = 0; x < newsItems.length; x++) {
        const newsItemHtml = $(newsItems[x]).html();
        // get the header
        console.log($('h3 > a', newsItemHtml)[0].attribs);
        console.log($('.td-excerpt', newsItemHtml).text());
      }
    } catch (err) {
      Logger.error(err);
      Logger.error('An error occurred when refreshing feeds.')
    }
  }
}

module.exports = FeedsJob;
