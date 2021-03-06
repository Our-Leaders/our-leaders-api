/**
 * Created by bolorundurowb on 14/11/2019
 */

const multer = require('multer');

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const ImageMiddleware = require('./../middleware/ImageMiddleware');
const JobValidators = require('./../validators/JobValidators');
const JobsCtrl = require('./../controllers/Jobs');

const Upload = multer({dest: 'uploads/'});

module.exports = (router) => {
  router.route('/jobs')
    .get(
      AuthMiddleware.optionalAuthenticate,
      JobsCtrl.retrieveJobListings
    )
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'jobs', action: 'create'}),
      Upload.single('file'),
      ImageMiddleware.uploadImage,
      JobValidators.validateCreation,
      JobsCtrl.addJobListing
    );

  router.route('/jobs/:jobId')
    .post(
      JobValidators.validateJobApplication,
      JobsCtrl.applyToJobListing
    )
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'jobs', action: 'update'}),
      Upload.single('file'),
      ImageMiddleware.uploadImage,
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

  router.route('/jobs/categories')
    .get(
      JobsCtrl.getJobCategories,
    );

  router.route('/jobs/categories/:categoryName')
    .delete(
      AuthMiddleware.authenticate,
      AuthMiddleware.isSuperAdmin,
      JobsCtrl.removeCategory
    );
};
