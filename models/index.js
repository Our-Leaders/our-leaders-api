/**
 * Created by bolorundurowb on 06/11/2019
 */

const mongoose = require('mongoose');

const Config = require('./../config/Config');
const Logger = require('./../config/Logger');
const PoliticalParty = require('./PoliticalParty');
const Politician = require('./Politician');
const Tag = require('./Tag');
const Feed = require('./Feed');
const User = require('./User');
const Subscription = require('./Subscription');
const Job = require('./Job');
const Page = require('./Page');

const db = {};
mongoose.connect(Config.database, {
  useNewUrlParser: true
}).then(() => Logger.log('Database set up successfully.'));

// inject models into return object here
db.PoliticalParty = PoliticalParty;
db.Politician = Politician;
db.Tag = Tag;
db.Feed = Feed;
db.User = User;
db.Subscription = Subscription;
db.Job = Job;
db.Page = Page;

module.exports = db;
