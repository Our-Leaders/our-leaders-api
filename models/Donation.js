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
  }
}, {
  timestamp: true
}));

module.exports = DonationModel;
