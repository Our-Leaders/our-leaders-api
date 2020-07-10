/**
 * Created by bolor on 5/22/2020
 */

const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StatisticModel = mongoose.model('Statistic', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  referrer: {
    type: String
  },
  pageTitle: {
    type: String
  },
  pageUrl: {
    type: String
  },
  userIp: {
    type: String
  },
  origin: {
    type: String
  }
}, {
  timestamps: true
}));

module.exports = StatisticModel;
