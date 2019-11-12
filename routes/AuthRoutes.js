/**
 * Created by bolorundurowb on 11/11/2019
 */

const AuthCtrl = require('./../controllers/Auth');
const AuthValidators = require('../validators/AuthValidators');

module.exports = (router) => {
  router.route('/auth/signup')
    .post(AuthValidators.validateSignUp, AuthCtrl.signUp);
  
  router.route('/auth/login')
    .post(AuthCtrl.login);
};
