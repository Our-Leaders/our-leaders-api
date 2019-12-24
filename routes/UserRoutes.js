/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const UsersCtrl = require('./../controllers/Users');

module.exports = (router) => {
  router.route('/users/:userId/block')
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'users', action: 'update'}),
      UsersCtrl.blockUser
    );

  router.route('/users/:userId/unblock')
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'users', action: 'update'}),
      UsersCtrl.unblockUser
    );

  router.route('/users/:userId')
    .delete(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'users', action: 'delete'}),
      UsersCtrl.deleteAccount
    );

  router.route('/users')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      UsersCtrl.getUsers
    );

  router.route('/users/:userId/votes')
    .get(
      AuthMiddleware.authenticate,
      UsersCtrl.getVotes
    );
};
