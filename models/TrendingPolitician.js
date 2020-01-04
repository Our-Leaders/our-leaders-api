const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TrendingPoliticianModel = mongoose.model('TrendingPolitician', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  politician: {
    type: String,
    required: true,
    ref: 'Politician'
  },
  order: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
}));

module.exports = TrendingPoliticianModel;
