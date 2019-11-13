/**
 * Created by bolorundurowb on 13/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const PoliticalPartyCtrl = require('./../controllers/PoliticalParties');
const PoliticalPartyValidators = require('./../validators/PoliticalPartyValidators');

module.exports = (router) => {
  router.route('/political-party')
    .post(AuthMiddleware.authenticate, PoliticalPartyValidators.validateCreation, PoliticalPartyCtrl.create);
};
