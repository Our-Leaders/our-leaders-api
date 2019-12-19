/**
 * Created by bolorundurowb on 06/11/2019
 */

const AuthRoutes = require('./AuthRoutes');
const FeedRoutes = require('./FeedRoutes');
const JobRoutes = require('./JobRoutes');
const politicalPartyRoutes = require('./politicalPartyRoutes');
const politicianRoutes = require('./politicianRoutes');
const StatisticRoutes = require('./StatisticRoutes');
const SubscriptionRoutes = require('./SubscriptionRoutes');
const UserRoutes = require('./UserRoutes');
const AdminRoutes = require('./AdminRoutes');

module.exports = (router) => {
  AuthRoutes(router);
  FeedRoutes(router);
  JobRoutes(router);
  politicalPartyRoutes(router);
  politicianRoutes(router);
  StatisticRoutes(router);
  SubscriptionRoutes(router);
  UserRoutes(router);
  AdminRoutes(router);

  return router;
};
