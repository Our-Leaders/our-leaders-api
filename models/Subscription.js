/**
 * Created by bolorundurowb on 14/11/2019
 */

const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubscriptionModel = mongoose.model('Subscription', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  politician: {
    type: String,
    required: true,
    ref: 'Politician'
  },
  email: {
    type: String,
    required: true
  }
}));

module.exports = SubscriptionModel;
