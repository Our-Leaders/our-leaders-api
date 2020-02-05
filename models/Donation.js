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
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['void', 'verified'],
    default: 'void'
  },
  card: {
    cardType: {
      type: String
    },
    lastFour: {
      type: String
    },
    country: {
      type: String
    },
    expMonth: {
      type: String
    },
    expYear: {
      type: String
    }
  }
}, {
  timestamp: true
}));

module.exports = DonationModel;
