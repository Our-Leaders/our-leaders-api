/**
 * Created by bolorundurowb on 06/11/2019
 */

const AuthRoutes = require('./AuthRoutes');
const FeedRoutes = require('./FeedRoutes');
const politicalPartyRoutes = require('./politicalPartyRoutes');
const politicianRoutes = require('./politicianRoutes');
const StatisticRoutes = require('./StatisticRoutes');
const SubscriptionRoutes = require('./SubscriptionRoutes');
const UserRoutes = require('./UserRoutes');

module.exports = (router) => {
  AuthRoutes(router);
  FeedRoutes(router);
  politicalPartyRoutes(router);
  politicianRoutes(router);
  StatisticRoutes(router);
  SubscriptionRoutes(router);
  UserRoutes(router);

  return router;
};
