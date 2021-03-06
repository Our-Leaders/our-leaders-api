/**
 * Created by bolorundurowb on 11/11/2019
 */

const AuthCtrl = require('./../controllers/Auth');
const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const AuthValidators = require('../validators/AuthValidators');

module.exports = (router) => {
  router.route('/auth/signup')
    .post(AuthValidators.validateSignUp, AuthCtrl.signUp);

  router.route('/auth/login')
    .post(AuthValidators.validateSignUp, AuthCtrl.login);

  router.route('/auth/login/admin')
    .post(AuthValidators.validateAdminLogin, AuthCtrl.adminLogin);

  router.route('/auth/verify')
    .get(
      AuthMiddleware.authenticate,
      AuthValidators.validateVerificationRequest,
      AuthCtrl.resendVerificationCode
    )
    .post(
      AuthMiddleware.authenticate,
      AuthValidators.validateVerificationCode,
      AuthCtrl.verifyCode
    );

  router.route('/auth/resend-verification')
    .post(
      AuthMiddleware.authenticate,
      AuthCtrl.resendVerificationCode
    );

  router.route('/auth/request-reset')
    .post(AuthValidators.validateResetRequest, AuthCtrl.requestPasswordReset);

  router.route('/auth/reset-password')
    .post(AuthValidators.validatePasswordReset, AuthCtrl.resetPassword);
};
