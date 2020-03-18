/**
 * Created by bolorundurowb on 09/11/2019
 */

const shortId = require('shortid');
const mongoose = require('mongoose');
const countryCodes = require('./../config/static/countries.json').map(x => x.code);

const Schema = mongoose.Schema;

const PoliticalPartyModel = mongoose.model('PoliticalParty', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  name: {
    type: String
  },
  country: {
    type: String,
    required: true,
    enum: countryCodes,
    default: 'NG'
  },
  acronym: {
    type: String
  },
  logo: {
    publicId: {
      type: String
    },
    url: {
      type: String
    }
  },
  ideology: {
    type: String
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
  },
  partyBackground: {
    type: String
  },
  partyDescription: {
    founded: {
      type: Number
    },
    partyChairman: {
      type: String
    }
  },
  votes: {
    down: [{
      user: {
        type: String,
        ref: 'User'
      }
    }],
    up: [{
      user: {
        type: String,
        ref: 'User'
      }
    }]
  }
}, {
  timestamps: true
}));

module.exports = PoliticalPartyModel;
