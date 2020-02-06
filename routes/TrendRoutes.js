const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const TrendsCtrl = require('./../controllers/Trends');
const TrendValidators = require('./../validators/TrendValidators');

module.exports = (router) => {
  router.route('/trending-politicians')
    .get(TrendsCtrl.getTrendingPoliticians);

  router.route('/trends')
    .get(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      TrendsCtrl.get
    )
    .post(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'trends', action: 'create'}),
      TrendValidators.validateCreation,
      TrendsCtrl.create
    )
    .delete(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'trends', action: 'delete'}),
      TrendsCtrl.deleteAll
    );

  router.route('/trends/:id')
    .put(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'trends', action: 'update'}),
      TrendValidators.validateUpdate,
      TrendsCtrl.update
    )
    .delete(
      AuthMiddleware.authenticate,
      AuthMiddleware.isAdmin,
      AuthMiddleware.hasPermission({property: 'trends', action: 'delete'}),
      TrendsCtrl.delete
    );
};
