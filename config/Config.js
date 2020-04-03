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
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID
  },
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    secret: process.env.CLOUDINARY_API_SECRET
  },
  feedUrl: 'https://www.tostvnetwork.com/category/news/',
  superAdmin: {
    email: process.env.SUPER_EMAIL,
    password: process.env.SUPER_PASS,
    firstName: 'Super',
    lastName: 'Admin'
  },
  paystack: {
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
    secretKey: process.env.PAYSTACK_SECRET_KEY
  },
  mailChimp: {
    apiKey: process.env.MAILCHIMP_API_KEY,
    listId: process.env.MAILCHIMP_LIST_ID
  },
  africasTalking: {
    apiKey: process.env.AF_API_KEY,
    username: process.env.AF_USERNAME
  }
};
