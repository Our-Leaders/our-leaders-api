const {ErrorHandler} = require('../utils/ErrorUtil');
const db = require('./../models');
const EmailUtil = require('./../utils/EmailUtil');
const Mail = require('./../communications/Email');

class Support {
  static async sendMessage(req, res, next) {
    const { message } = req.body;

    try {
      const admins = await db.User.find({
        $or: [{
          role: 'admin'
        }, {
          role: 'superadmin'
        }]
      }).select('email');

      const emails = admins.map(x => x.email);

      const payload = EmailUtil.getContactUsEmail(message, emails);
      await Mail.send(payload);

      res.status(200).send({
        message: 'Message sent successfully. We will get back to you in 24hours. Thank you'
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.', err));
    }
  }
}

module.exports = Support;