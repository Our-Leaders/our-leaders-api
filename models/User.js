/**
 * Created by bolorundurowb on 08/11/2019
 */

const shortId = require('shortid');
const bcryptJs = require('bcryptjs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserModel = mongoose.model('User', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  phoneNumber: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true,
    set: function (val) {
      const salt = bcryptJs.genSaltSync(10);
      return bcryptJs.hashSync(val, salt);
    }
  },
  googleId: {
    type: String
  },
  facebookId: {
    type: String
  },
  gender: {
    type: String,
    enum: ['other', 'female', 'male'],
    default: 'other'
  },
  ageRange: {
    type: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: Boolean,
    enum: ['admin', 'superadmin']
  },
}, {
  timestamps: true
}));

module.exports = UserModel;
