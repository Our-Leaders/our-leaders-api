const af = require('africastalking');
const Config = require('./../config/Config');
const Logger = require('./../config/Logger');

const AfricasTalking = af({
  apiKey: Config.africasTalking.apiKey,
  username: Config.africasTalking.username
});

class Sms {
  static async sendMessage(recipient, message) {
    try {
      const sms = AfricasTalking.SMS;
      await sms.send({
        to: [recipient],
        message
      });

      Logger.log('SMS sent successfully.');
    } catch (err) {
      Logger.error(err);
    }
  };
}

module.exports = Sms;
