/**
 * Created by bolorundurowb on 14/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('./../utils/errorUtil');

class Subscriptions {
  static async addSubscription(req, res, next) {
    const {body} = req;

    try {
      let subscription = await db.Subscription.findOne({
        politician: body.politicianId,
        email: body.email
      });

      // if a subscription does not exist, create one
      if (!subscription) {
        subscription = new db.Subscription({
          politician: body.politicianId,
          email: body.email,
          frequency: body.frequency || 'daily'
        });
        await subscription.save();
      }

      res.status(200).send({
        message: 'Subscription created successfully.'
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Subscriptions;
