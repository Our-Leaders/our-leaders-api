/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const NotificationCtrl = require('./../controllers/Notifications');

module.exports = (router) => {
  router.route('/notifications')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'notifications', action: 'create'}),
      NotificationCtrl.create
    );
};
