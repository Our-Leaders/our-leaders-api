/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const JobValidators = require('./../validators/JobValidators');
const JobsCtrl = require('./../controllers/Jobs');

module.exports = (router) => {
  router.route('/jobs')
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      JobValidators.validateCreation,
      JobsCtrl.addJobListing
    );
};
