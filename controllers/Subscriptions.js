/**
 * Created by bolorundurowb on 14/11/2019
 */

const db = require('./../models');
const OutputFormatter = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');
const MailChimpUtil = require('./../utils/MailChimpUtil');

class Subscriptions {
  static async getSubscriptions(req, res, next) {
    const {email} = req.user;
    const {position} = req.query;

    try {
      let subscriptions = await db.Subscription
        .find({email})
        .populate('politician')
        .sort({createdAt: 'desc'});

      if (position) {
        subscriptions = subscriptions.filter((subscription) => {
          if (!subscription.politician) {
            return subscription;
          }

          const index = subscription.politician.politicalBackground.findIndex(bg => bg.position === position);
          if (index > -1) {
            return subscription;
          }
        });
      }

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

      const subscription = await db.Subscription
        .findOne({
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
    const {politicianId, email, type} = req.body;

    try {
      let subscription = await db.Subscription
        .findOne({
          email,
          type
        });

      // if a subscription does not exist, create one
      if (!subscription) {
        // if the subscription is for a newsletter, add to mailchimp
        if (type === 'newsletter') {
          let user;

          // if caller is authenticated then
          if (req.user) {
            user = await db.User
              .findById(req.user.id);
          } else {
            user = {
              email
            }
          }

          await MailChimpUtil.addUserToList(user);
        }

        subscription = new db.Subscription({
          politician: politicianId,
          email,
          type
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
    const {email} = req.user;

    try {
      const subscription = await db.Subscription
        .findOne({
          _id: subscriptionId,
          email
        });

      if (subscription) {
        await db.Subscription
          .findByIdAndDelete(subscriptionId);
      }

      res.status(200).send({
        message: 'Unsubscription successful.'
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async removePoliticianSubscriptions(req, res, next) {
    const {politicianId} = req.params;
    const {email} = req.user;

    try {
      await db.Subscription.deleteMany({politician: politicianId, email });

      res.status(200).send({
        message: 'Unsubscription from politician successful.'
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Subscriptions;
