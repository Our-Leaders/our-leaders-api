/**
 * Created by bolorundurowb on 14/11/2019
 */
const multer = require('multer');
const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const ImageMiddleware = require('./../middleware/ImageMiddleware');
const UsersCtrl = require('./../controllers/Users');

const Upload = multer({dest: 'uploads/'});

module.exports = (router) => {
  router.route('/users')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      UsersCtrl.getUsers
    );

    router.route('/users/stats')
      .get(
        AuthMiddleware.authenticate,
        AuthMiddleware.isAdmin,
        UsersCtrl.getUserStats
      )

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

  router.route('/users/:userId/votes')
    .get(
      AuthMiddleware.authenticate,
      UsersCtrl.getVotes
    );

  router.route('/users/:userId')
    .put(
      AuthMiddleware.authenticate,
      Upload.single('file'),
      ImageMiddleware.uploadImage,
      UsersCtrl.updateUser
    )
    .delete(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'users', action: 'delete'}),
      UsersCtrl.deleteAccount
    );

  router.route('/users/:userId/delete-my-account')
    .put(
      AuthMiddleware.authenticate,
      UsersCtrl.deleteAccount
    );
};
