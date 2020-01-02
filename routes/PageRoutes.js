/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const PagesCtrl = require('./../controllers/Pages');

module.exports = (router) => {
  router.route('/pages')
    .get(
      PagesCtrl.getPages
    )
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'pages', action: 'update'}),
      PagesCtrl.updatePages
    );
};
