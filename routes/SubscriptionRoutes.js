/**
 * Created by bolorundurowb on 14/11/2019
 */

const SubscriptionCtrl = require('./../controllers/Subscriptions');
const SubscriptionValidators = require('./../validators/SubscriptionValidators');

module.exports = (router) => {
  router.route('/subscriptions')
    .post(
      SubscriptionValidators.validateCreation,
      SubscriptionCtrl.addSubscription
    );
};
