/**
 * Created by bolorundurowb on 22/02/2020
 */

class NotificationValidators {
  static validateCreation(req, res, next) {
    const {body} = req;
    let message = '';

    if (!body.message) {
      message = 'A message is required.';
    } else if (body.entityId && !body.entityType) {
      message = 'If an id is provided, the id type is required.'
    }

    if (message) {
      return res.status(400).send({
        message
      });
    } else {
      next();
    }
  }
}

module.exports = NotificationValidators;
