/**
 * Created by bolorundurowb on 22/02/2020
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const NotificationCtrl = require('./../controllers/Notifications');
const NotificationValidators = require('./../validators/NotificationValidators');

module.exports = (router) => {
  router.route('/notifications')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'notifications', action: 'create'}),
      NotificationValidators.validateCreation,
      NotificationCtrl.create
    );
};
