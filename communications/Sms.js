const axios = require('axios');

const Config = require('./../Config/Config');
const Logger = require('./../Config/Logger');

class Sms {
  static async sendMessage(recipient, message) {
    try {
      const response = await axios.get(`${Config.sms.baseUrl}/api/v1/http.php`, {
        params: {
          api_key: Config.sms.bsApiKey,
          recipient: recipient,
          message: message,
          sender: Config.sms.bsSenderId,
          route: 1
        }
      });

      Logger.log(response);
    } catch (err) {
      Logger.error(err);
    }
  };
};

module.exports = Sms;