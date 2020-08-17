/**
 * Created by bolor on 2/21/2020
 */

const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationModel = mongoose.model('Notification', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  addedBy: {
    type: String,
    ref: 'User',
    required: true
  },
  url: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  entityId: {
    type: String
  },
  entityType: {
    type: String,
    enum: ['politician', 'political-party']
  }
}, {
  timestamps: true
}));

module.exports = NotificationModel;
