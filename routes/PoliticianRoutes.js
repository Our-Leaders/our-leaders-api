const multer = require('multer');
const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const ImageMiddleware = require('./../middleware/ImageMiddleware');
const PoliticianCtrl = require('./../controllers/Politician');
const PoliticianValidators = require('./../validators/PoliticianValidators');

const Upload = multer({dest: 'uploads/'});

module.exports = (router) => {
  router.route('/politicians')
    .get(PoliticianCtrl.find)
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'politician', action: 'create'}),
      Upload.single('file'),
      ImageMiddleware.uploadImage,
      PoliticianValidators.validateCreation,
      PoliticianCtrl.create
    );

  router.route('/politicians/highest-voted')
    .get(PoliticianCtrl.getHighestVotedPoliticians);

  router.route('/politicians/:id')
    .get(PoliticianCtrl.get)
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'politician', action: 'update'}),
      Upload.single('file'),
      ImageMiddleware.uploadImage,
      PoliticianValidators.validatePoliticianUpdate,
      PoliticianCtrl.edit
    );

  router.route('/politicians/:id/accomplishments')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'accomplishments', action: 'create'}),
      Upload.single('file'),
      ImageMiddleware.uploadImage,
      PoliticianValidators.validateAccomplishmentsCreation,
      PoliticianCtrl.addAccomplishment
    );

  router.route('/politicians/:id/accomplishments/:accomplishmentId')
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'accomplishments', action: 'update'}),
      Upload.single('file'),
      ImageMiddleware.uploadImage,
      PoliticianValidators.validateAccomplishmentsCreation,
      PoliticianCtrl.updateAccomplishment
    )
    .delete(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'accomplishments', action: 'delete'}),
      PoliticianCtrl.deleteAccomplishment
    );

  router.route('/politicians/:id/background')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'politicianBackground', action: 'update'}),
      AuthMiddleware.hasPermission({property: 'politicianBackground', action: 'create'}),
      PoliticianValidators.validatePoliticalBackgroundUpsert,
      PoliticianValidators.validateEducationalBackgroundUpsert,
      PoliticianValidators.validateProfessionalBackgroundUpsert,
      PoliticianCtrl.addOrUpdatePoliticianBackground
    );

  router.route('/politicians/:id/vote')
    .post(
      AuthMiddleware.authenticate,
      PoliticianValidators.validateVotes,
      PoliticianCtrl.addVote
    );
};
