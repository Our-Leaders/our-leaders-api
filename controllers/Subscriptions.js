/**
 * Created by bolorundurowb on 14/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Subscriptions {
  static async checkSubscription(req, res, next) {
    const {politicianId} = req.params;
    const {id} = req.user;

    try {
      if (!politicianId) {
        return next(new ErrorHandler(400, 'A politician id is required as a query param.'));
      }

      const subscription = await db.Subscription({
        politician: politicianId,
        user: id
      });

      if (!subscription) {
        return res.status(404).send({
          message: 'You are not subscribed to the specified politician.'
        });
      }

      return res.status(200).send({
        message: 'You are subscribed to the specified politician.'
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

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
