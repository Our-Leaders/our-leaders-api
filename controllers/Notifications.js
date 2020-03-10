/**
 * Created by bolorundurowb on 22/02/2020
 */

const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Notifications {
  static async getAll(req, res, next) {
    try {
      const user = await db.User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler(404, 'Caller not found.'));
      }

      // if the user has not accessed notifications, then use the unix epoch
      const notificationLastAccessedAt = user.notificationsLastRetrievedAt || new Date(1970, 0, 1);

      const subscriptions = await db.Subscription
        .find({
          email: user.email
        })
        .select('politician');
      const subscribedPoliticians = subscriptions.map(x => x.politician);

      const notifications = await db.Notification
        .find({
          $and: [
            {
              createdAt: {
                $gte: notificationLastAccessedAt
              }
            },
            {
              $or: [
                {
                  entityType: 'politician',
                  entityId: {
                    $in: subscribedPoliticians
                  }
                },
                {
                  entityType: 'political-party'
                }
              ]
            }
          ]
        });

      // update user last seen
      user.notificationsLastRetrievedAt = new Date();
      await user.save();

      res.status(200).send({
        notifications: notifications.map(x => OutputFormatters.formatNotification(x))
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async create(req, res, next) {
    const {body, user} = req;
    const {url, message, entityId, entityType} = body;

    try {
      const notification = new db.Notification({
        addedBy: user.id,
        url,
        message,
        entityType,
        entityId
      });
      await notification.save();

      res.status(200).send({
        notification: OutputFormatters.formatNotification(notification)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Notifications;
