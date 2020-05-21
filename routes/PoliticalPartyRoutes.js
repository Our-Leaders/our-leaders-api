/**
 * Created by bolorundurowb on 13/11/2019
 */
const multer = require('multer');

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const PoliticalPartyCtrl = require('./../controllers/PoliticalParties');
const PoliticalPartyValidators = require('./../validators/PoliticalPartyValidators');
const ImageMiddleware = require('./../middleware/ImageMiddleware');

const Upload = multer({dest: 'uploads/'});

module.exports = (router) => {
  router.route('/political-party')
    .get(PoliticalPartyCtrl.find)
    .post(
      AuthMiddleware.authenticate,
      Upload.single('file'),
      ImageMiddleware.uploadLogo,
      PoliticalPartyValidators.validateCreation,
      PoliticalPartyCtrl.create
    )
    .delete(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      PoliticalPartyCtrl.delete
    )

  router.route('/political-party/:id')
    .get(PoliticalPartyCtrl.get)
    .put(
      AuthMiddleware.authenticate,
      Upload.single('file'),
      ImageMiddleware.uploadLogo,
      PoliticalPartyValidators.validateUpdate,
      PoliticalPartyCtrl.edit
    );

  router.route('/political-party/:id/vote')
    .post(
      AuthMiddleware.authenticate,
      PoliticalPartyValidators.validateVotes,
      PoliticalPartyCtrl.addVote
    );
};
