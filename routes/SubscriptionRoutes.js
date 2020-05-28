/**
 * Created by bolorundurowb on 14/11/2019
 */

const AuthMiddleware = require('./../middleware/AuthenticationMiddleware');
const SubscriptionCtrl = require('./../controllers/Subscriptions');
const SubscriptionValidators = require('./../validators/SubscriptionValidators');

module.exports = (router) => {
  router.route('/subscriptions')
    .get(
      AuthMiddleware.authenticate,
      SubscriptionCtrl.getSubscriptions
    )
    .post(
      AuthMiddleware.optionalAuthenticate,
      SubscriptionValidators.validateCreation,
      SubscriptionCtrl.addSubscription
    );

  router.route('/subscriptions/check/:politicianId')
    .get(
      AuthMiddleware.authenticate,
      SubscriptionCtrl.checkSubscription
    );

  router.route('/subscriptions/:subscriptionId')
    .delete(
      AuthMiddleware.authenticate,
      SubscriptionCtrl.removeSubscription
    );

  router.route('/subscriptions/politicians/:politicianId')
    .delete(
      AuthMiddleware.authenticate,
      SubscriptionCtrl.removePoliticianSubscriptions
    );
};
