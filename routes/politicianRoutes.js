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
      AuthMiddleware.hasPermission({property: 'politician', action: 'create'}),
      PoliticianValidators.validateCreation,
      PoliticianCtrl.create
    );

  router.route('/politicians/highest-voted')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      PoliticianCtrl.getHighestVotedPoliticians
    );

  router.route('/politicians/:id')
    .get(PoliticianCtrl.get)
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'politician', action: 'update'}),
      ImageMiddleware.uploadImage,
      PoliticianValidators.validatePoliticianUpdate,
      PoliticianCtrl.edit
    );

  router.route('/politicians/:id/accomplishments')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'accomplishments', action: 'create'}),
      PoliticianValidators.validateAccomplishmentsCreation,
      ImageMiddleware.uploadImage,
      PoliticianCtrl.addAccomplishment
    );

  router.route('/politicians/:id/educational-background')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'educationalBackground', action: 'create'}),
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
      AuthMiddleware.hasPermission({property: 'politicalBackground', action: 'create'}),
      PoliticianValidators.validatePoliticalBackgroundCreation,
      PoliticianCtrl.addPoliticalBackground
    );

  router.route('/politicians/:id/professional-background')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'professionalBackground', action: 'create'}),
      PoliticianValidators.validateProfessionalBackgroundCreation,
      PoliticianCtrl.addProfessionalBackground
    );
};
