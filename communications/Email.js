/**
 * Created by bolorundurowb on 03/12/2019
 */

const Mailgun = require('mailgun.js');

const Config = require('./../config/Config');
const Logger = require('./../config/Logger');

const mg = Mailgun.client({
  username: 'api',
  key: Config.mailGun.apiKey
});

/**
 * Hold all email configuration and delivery logic
 */
class Email {
  /**
   * Sends an email using MailGun
   * @param {Object} payload
   */
  static async send(payload) {
    try {
      console.log('Config.mailGun.apiKey');
      console.log(Config.mailGun.apiKey);
      await mg.messages.create(Config.mailGun.domain, payload);
      Logger.log('The email(s) was/were sent successfully.');
    } catch (err) {
      console.log(err);
      Logger.error(err);
    }
  }
}

module.exports = Email;
