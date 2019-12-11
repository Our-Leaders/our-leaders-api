/**
 * Created by bolorundurowb on 06/11/2019
 */

const AuthRoutes = require('./AuthRoutes');
const politicianRoutes = require('./politicianRoutes');
const SubscriptionRoutes = require('./SubscriptionRoutes');
const FeedRoutes = require('./FeedRoutes');
const StatisticRoutes = require('./StatisticRoutes');

module.exports = (router) => {
  AuthRoutes(router);
  politicianRoutes(router);
  SubscriptionRoutes(router);
  FeedRoutes(router);
  StatisticRoutes(router);

  return router;
};
