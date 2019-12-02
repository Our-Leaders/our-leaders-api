/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const FeedsCtrl = require('./../controllers/Feeds');

module.exports = (router) => {
  router.route('/feeds')
    .get(
      AuthMiddleware.authenticate,
      FeedsCtrl.getFeeds
    );
};
