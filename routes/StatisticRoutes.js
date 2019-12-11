/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const StatisticsCtrl = require('./../controllers/Statistics');

module.exports = (router) => {
  router.route('/statistics')
    .post(
      AuthMiddleware.authenticate,
      StatisticsCtrl.getStats
    );
};
