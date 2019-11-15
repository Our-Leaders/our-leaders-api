
const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const ImageMiddleware = require('./../middleware/ImageMiddleware');
const PoliticianCtrl = require('./../controllers/Politician');
const PoliticianValidators = require('./../validators/PoliticianValidators');

module.exports = (router) => {
  router.route('/politicians')
    .get(PoliticianCtrl.find)
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      PoliticianValidators.validateCreation,
      PoliticianCtrl.create
    );

  router.route('/politicians/:id')
    .get(PoliticianCtrl.get);

  router.route('/politicians/:id/accomplishments')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      PoliticianValidators.validateAccomplishmentsCreation,
      ImageMiddleware.uploadImage,
      PoliticianCtrl.addAccomplishment
    );

  router.route('/politicians/:id/educational-background')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      PoliticianValidators.validateEducationalBackgroundCreation,
      PoliticianCtrl.addEducationalBackground
    );

  router.route('/politicians/:id/vote')
    .post(
      AuthMiddleware.authenticate,
      PoliticianValidators.validateVotes,
      PoliticianCtrl.addVote
    );

  router.route('/politicians/:id/political-background')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      PoliticianValidators.validatePoliticalBackgroundCreation,
      PoliticianCtrl.addPoliticalBackground
    );
};
