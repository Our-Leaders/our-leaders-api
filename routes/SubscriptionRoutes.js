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
      AuthMiddleware.authenticate,
      SubscriptionValidators.validateCreation,
      SubscriptionCtrl.addSubscription
    );
};
