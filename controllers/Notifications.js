/**
 * Created by bolorundurowb on 22/02/2020
 */

const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Notifications {
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
