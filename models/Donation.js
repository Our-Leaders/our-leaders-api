const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DonationModel = mongoose.model('Donation', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  amount: {
    type: Number
  },
  transactionReference: {
    type: String,
    required: true
  }
}, {
  timestamp: true
}));

module.exports = DonationModel;
