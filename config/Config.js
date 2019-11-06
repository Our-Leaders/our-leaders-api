/**
 * Created by bolorundurowb on 06/11/2019
 */

const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
if (!isProduction) {
  dotenv.config({silent: true});
}

module.exports = {
  isProduction,
  database: process.env.MONGO_URL,
  frontEndUrl: process.env.FRONTEND_URL,
  port: process.env.PORT || 3505,
  secret: process.env.SECRET,
  mailGun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};
