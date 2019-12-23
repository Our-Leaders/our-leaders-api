/**
 * Created by bolorundurowb on 14/11/2019
 */

const db = require('./../models');
const OutputFormatter = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Subscriptions {
  static async getSubscriptions(req, res, next) {
    const {id} = req.user;

    try {
      const subscriptions = await db.Subscription
        .find({
          user: id
        })
        .populate('politician');

      res.status(200).send({
        subscriptions: subscriptions.map(x => OutputFormatter.formatSubscription(x))
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
