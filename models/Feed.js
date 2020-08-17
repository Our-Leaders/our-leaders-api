/**
 * Created by bolorundurowb on 29/11/2019
 */

const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FeedModel = mongoose.model('Feed', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  title: {
    type: String
  },
  summary: {
    type: String
  },
  feedUrl: {
    type: String
  },
  publishedAt: {
    type: Date
  },
  politicians: [{
    type: String,
    ref: 'Politician'
  }]
}, {
  timestamps: true
}));

module.exports = FeedModel;
