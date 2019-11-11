/**
 * Created by bolorundurowb on 11/11/2019
 */

const {OAuth2Client} = require('google-auth-library');
const Config = require('./../config/Config');

const googleClient = new OAuth2Client(Config.google.clientId);

class GoogleUtil {
  static async verifyToken(token) {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: Config.google.clientId
    });
    return  ticket.getPayload();
  }
}

module.exports = GoogleUtil;
