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
    .post(
      AuthMiddleware.authenticate,
      Upload.single('file'),
      ImageMiddleware.uploadLogo,
      PoliticalPartyValidators.validateCreation,
      PoliticalPartyCtrl.create
    )
    .get(PoliticalPartyCtrl.find);
};
