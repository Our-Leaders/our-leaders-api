/**
 * Created by bolorundurowb on 14/11/2019
 */

const db = require('./../models');
const OutputFormatter = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Subscriptions {
  static async getSubscriptions(req, res, next) {
    const {email} = req.user;

    try {
      const subscriptions = await db.Subscription
        .find({email})
        .populate('politician')
        .sort({createdAt: 'desc'});

      res.status(200).send({
        subscriptions: subscriptions.map(x => OutputFormatter.formatSubscription(x))
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async checkSubscription(req, res, next) {
    const {politicianId} = req.params;
    const {email} = req.user;

    try {
      if (!politicianId) {
        return next(new ErrorHandler(400, 'A politician id is required as a query param.'));
      }

      const subscription = await db.Subscription({
        politician: politicianId,
        email
      });

      if (!subscription) {
        return res.status(404).send({
          message: 'You are not subscribed to the specified politician.'
        });
      }

      return res.status(200).send({
        message: 'You are subscribed to the specified politician.',
        subscription: OutputFormatter.formatSubscription(subscription)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async addSubscription(req, res, next) {
    const {body, user} = req;
    const {id} = user;

    try {
      let subscription = await db.Subscription.findOne({
        politician: body.politicianId,
        user: id
      });

      // if a subscription does not exist, create one
      if (!subscription) {
        subscription = new db.Subscription({
          politician: body.politicianId,
          frequency: body.frequency || 'daily',
          user: id
        });
        await subscription.save();
      }

      res.status(200).send({
        message: 'Subscription created successfully.',
        subscription: OutputFormatter.formatSubscription(subscription)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async removeSubscription(req, res, next) {
    const {subscriptionId} = req.params;
    const {id} = req.user;

    try {
      const subscription = await db.Subscription.findOne({
        _id: subscriptionId,
        user: id
      });

      if (subscription) {
        await db.Subscription.findByIdAndDelete(subscriptionId);
      }

      res.status(200).send({
        message: 'Unsubscription successful.'
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Subscriptions;
