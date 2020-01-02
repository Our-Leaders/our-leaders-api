/**
 * Created by bolorundurowb on 06/11/2019
 */

const AdminRoutes = require('./AdminRoutes');
const AuthRoutes = require('./AuthRoutes');
const FeedRoutes = require('./FeedRoutes');
const JobRoutes = require('./JobRoutes');
const PageRoutes = require('./PageRoutes');
const PoliticalPartyRoutes = require('./PoliticalPartyRoutes');
const PoliticianRoutes = require('./PoliticianRoutes');
const StatisticRoutes = require('./StatisticRoutes');
const SubscriptionRoutes = require('./SubscriptionRoutes');
const UserRoutes = require('./UserRoutes');

module.exports = (router) => {
  AdminRoutes(router);
  AuthRoutes(router);
  FeedRoutes(router);
  JobRoutes(router);
  PageRoutes(router);
  PoliticalPartyRoutes(router);
  PoliticianRoutes(router);
  StatisticRoutes(router);
  SubscriptionRoutes(router);
  UserRoutes(router);

  return router;
};
