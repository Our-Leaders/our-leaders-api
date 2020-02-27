/**
 * Created by bolor on 2/27/2020
 */

const MailChimp = require('mailchimp-api-v3');
const Config = require('./../config/Config');

const mailChimp = new MailChimp(Config.mailChimp.apiKey);

class MailChimpUtil {
  static async addUserToList(user) {

  }
}
