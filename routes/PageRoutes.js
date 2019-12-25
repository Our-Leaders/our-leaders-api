/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const PagesCtrl = require('./../controllers/Pages');

module.exports = (router) => {
  router.route('/pages')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      PagesCtrl.getPages
    );
};
