/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const AdminValidators = require('./../validators/AdminValidators');
const AdminsCtrl = require('./../controllers/Admins');

module.exports = (router) => {
  router.route('/admins')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AdminsCtrl.findAdmin
    )
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isSuperAdmin,
      AdminValidators.validateCreation,
      AdminsCtrl.createAdmin
    );

  router.route('/admins/:adminId')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isSuperAdmin,
      AdminsCtrl.reactivateAdmin
    )
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isSuperAdmin,
      AdminsCtrl.updateAdmin
    )
    .delete(
      AuthMiddleware.authenticate,
      AuthMiddleware.isSuperAdmin,
      AdminsCtrl.deleteAdmin
    );

  router.route('/admins/:adminId/status')
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isSuperAdmin,
      AdminsCtrl.updateAdminStatus
    );
};
