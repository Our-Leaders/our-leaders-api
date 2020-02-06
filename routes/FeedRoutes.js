/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const FeedsCtrl = require('./../controllers/Feeds');

module.exports = (router) => {
  router.route('/feeds/user')
    .get(
      AuthMiddleware.authenticate,
      FeedsCtrl.getUserFeeds
    );

  router.route('/feeds/politician/:politicianId')
    .get(
      AuthMiddleware.authenticate,
      FeedsCtrl.getPoliticianFeeds
    );
};
