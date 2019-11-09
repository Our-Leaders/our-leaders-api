/**
 * Created by bolorundurowb on 06/11/2019
 */

const mongoose = require('mongoose');
const Config = require('./../config/Config');
const Logger = require('./../config/Logger');
const PoliticalParty = require('./PoliticalParty');
const Tag = require('./Tag');
const User = require('./User');

// import models here

const db = {};
mongoose.connect(Config.database, {
  useNewUrlParser: true
}).then(() => Logger.log('Database set up successfully.'));

// inject models into return object here
db.PoliticalParty = PoliticalParty;
db.Tag = Tag;
db.User = User;

module.exports = db;
