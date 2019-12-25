const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const JobModel = mongoose.model('Job', new Schema({
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
  },
  type: {
    type: String,
    enum: ['full', 'contract']
  },
  location: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  applicationLink: {
    type: String
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
}));

module.exports = JobModel;
