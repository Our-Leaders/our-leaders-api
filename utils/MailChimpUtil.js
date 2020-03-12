/**
 * Created by bolor on 2/27/2020
 */

const MailChimp = require('mailchimp-api-v3');
const Config = require('./../config/Config');

const mailChimp = new MailChimp(Config.mailChimp.apiKey);

class MailChimpUtil {
  static async addUserToList(user) {
    await mailChimp.post(`/lists/${Config.mailChimp.listId}/members`, {
      email_address: user.email,
      email_type: 'html',
      status: 'subscribed',
      timestamp_signup: (new Date()).toISOString()
    });
  }
}

module.exports = MailChimpUtil;