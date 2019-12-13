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
      AuthMiddleware.hasPermission({property: 'jobs', action: 'create'}),
      JobValidators.validateCreation,
      JobsCtrl.addJobListing
    );

  router.route('/jobs/:jobId')
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'jobs', action: 'update'}),
      JobsCtrl.updateJobListing
    );

  router.route('/jobs/:jobId/archive')
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'jobs', action: 'update'}),
      JobsCtrl.archiveJobListing
    );

  router.route('/jobs/:jobId/unarchive')
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'jobs', action: 'update'}),
      JobsCtrl.unarchiveJobListing
    );
};
