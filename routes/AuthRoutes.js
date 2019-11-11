/**
 * Created by bolorundurowb on 11/11/2019
 */

const AuthCtrl = require('./../controllers/Auth');
const AuthValidators = require('../validators/AuthValidators');

class AuthRoutes {
  static route(router) {
    router.route('/v1/auth/register')
      .post(AuthValidators.validateSignUp, AuthCtrl.signUp);
  }
}

module.exports = AuthRoutes;
