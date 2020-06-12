/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const StatisticsCtrl = require('./../controllers/Statistics');

module.exports = (router) => {
  router.route('/statistics')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      StatisticsCtrl.getStats
    );

  router.route('/statistics/visit')
    .post(
      StatisticsCtrl.recordVisitStat
    );

  router.route('/statistics/visit')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      StatisticsCtrl.getVisitStats
    );

  router.route('/statistics/signup')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      StatisticsCtrl.getSignupStats
    );

  router.route('/statistics/donations')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      StatisticsCtrl.getDonations
    );

  router.route('/statistics/donations/plot')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      StatisticsCtrl.getDonationPlotStats
    );
};
