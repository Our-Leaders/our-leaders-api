/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const AdminValidators = require('./../validators/AdminValidators');
const AdminsCtrl = require('./../controllers/Admins');

module.exports = (router) => {
  router.route('/admins')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isSuperAdmin,
      AdminValidators.validateCreation,
      AdminsCtrl.createAdmin
    );

  router.route('/admins/:adminId')
    .delete(
      AuthMiddleware.authenticate,
      AuthMiddleware.isSuperAdmin,
      AdminsCtrl.deleteAdmin
    );
};
