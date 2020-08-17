/**
 * Created by bolorundurowb on 11/11/2019
 */

const axios = require('axios');
const Config = require('./../config/Config');

class FacebookUtil {
  static async verifyToken(token) {
    const userRetrievalUrl = `https://graph.facebook.com/me?fields=id,first_name,last_name,email,gender&access_token=${token}`;
    const response = await axios.get(userRetrievalUrl);

    return response.data;
  }
}

module.exports = FacebookUtil;
