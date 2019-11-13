/**
 * Created by bolorundurowb on 09/11/2019
 */

const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PoliticalPartyModel = mongoose.model('PoliticalParty', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  logo: {
    publicId: {
      type: String
    },
    url: {
      type: String
    }
  },
  yearEstablished: {
    type: Number
  },
  partyLeader: {
    type: String
  },
  ideology: {
    type: String
  },
  numOfPartyMembers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
}));

module.exports = PoliticalPartyModel;
