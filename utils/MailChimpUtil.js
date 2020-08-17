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
      timestamp_signup: MailChimpUtil.getMailChimpDateTimeStamp()
    });
  }

  static getMailChimpDateTimeStamp() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
}

module.exports = MailChimpUtil;
