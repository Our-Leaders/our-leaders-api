/**
 * Created by bolorundurowb on 24/02/2020
 */

const db = require('./../models');
 
class NotificationUtil {
  static async createPoliticianNotification(message, userId, politicianId) {
    const notification = new db.Notification({
      addedBy: userId,
      url: '',
      message: message,
      entityId: politicianId,
      entityType: 'politician'
    });
    await notification.save();
  }
}

module.exports = NotificationUtil;
