/**
 * Created by bolorundurowb on 25/12/2019
 */

const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PageModel = mongoose.model('Page', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  aboutUs: {
    type: String
  },
  contact: {
    address: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    email: {
      type: String
    }
  },
  socials: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    twitter: {
      type: String
    },
    linkedIn: {
      type: String
    }
  }
}, {
  timestamps: true
}));

module.exports = PageModel;
