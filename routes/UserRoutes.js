/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const UsersCtrl = require('./../controllers/Users');

module.exports = (router) => {
  router.route('/users/:userId/block')
    .put(
      AuthMiddleware.authenticate,
      UsersCtrl.blockUser
    );

  router.route('/users/:userId/unblock')
    .put(
      AuthMiddleware.authenticate,
      UsersCtrl.unblockUser
    );
};
