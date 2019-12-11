/**
 * Created by bolorundurowb on 06/11/2019
 */

const AuthRoutes = require('./AuthRoutes');
const politicalPartyRoutes = require('./politicalPartyRoutes');
const politicianRoutes = require('./politicianRoutes');
const SubscriptionRoutes = require('./SubscriptionRoutes');
const FeedRoutes = require('./FeedRoutes');

module.exports = (router) => {
  AuthRoutes(router);
  politicalPartyRoutes(router);
  politicianRoutes(router);
  SubscriptionRoutes(router);
  FeedRoutes(router);

  return router;
};
