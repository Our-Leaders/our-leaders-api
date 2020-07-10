/**
 * Created by bolor on 7/10/2020
 */

const axios = require('axios');

class GeoCodingUtils {
  static async getLocationFromIp(ipAddress) {
    const baseUrl = 'http://ip-api.com/json';
    const requestUrl = `${baseUrl}/${ipAddress}`;

    try {
      const response = await axios.get(requestUrl);
      const data = response.data;

      if (data.status === 'success') {
        return `${data.city}, ${data.country}`;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
}

module.exports = GeoCodingUtils;
