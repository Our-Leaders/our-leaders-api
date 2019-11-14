
const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const PoliticianCtrl = require('./../controllers/Politician');
const PoliticianValidators = require('./../validators/PoliticianValidators');

module.exports = (router) => {
  router.route('/politicians')
    .get(PoliticianCtrl.find);

  router.route('/politicians/:id')
    .get(PoliticianCtrl.get);

  router.route('/politicians')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      PoliticianValidators.validateCreation,
      PoliticianCtrl.create
    );
};
