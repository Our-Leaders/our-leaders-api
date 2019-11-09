const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TagModel = mongoose.model('Tag', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}));

module.exports = TagModel;