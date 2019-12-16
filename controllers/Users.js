/**
 * Created by bolorundurowb on 11/12/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/errorUtil');
const OutputFormatters = require('./../utils/OutputFormatters');

class Users {
  static async blockUser(req, res, next) {
    const {userId} = req.params;

    try {
      const user = await db.User.findById(userId);

      if (!user) {
        return next(new ErrorHandler(404, 'A user with the provided id does not exist.'));
      }

      user.isBlocked = true;
      await user.save();

      res.status(200).send({
        user: OutputFormatters.formatUser(user)
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.'));
    }
  }

  static async unblockUser(req, res, next) {
    const {userId} = req.params;

    try {
      const user = await db.User.findById(userId);

      if (!user) {
        return next(new ErrorHandler(404, 'A user with the provided id does not exist.'));
      }

      user.isBlocked = false;
      await user.save();

      res.status(200).send({
        user: OutputFormatters.formatUser(user)
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.'));
    }
  }

  static async deleteAccount(req, res, next) {
    const {userId} = req.params;

    try {
      const user = await db.User.findById(userId);

      if (!user) {
        return next(new ErrorHandler(404, 'A user with the provided id does not exist.'));
      }

      user.isDeleted = true;
      await user.save();

      res.status(200).send({
        message: 'User account successfully deleted.'
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.'));
    }
  }
}

module.exports = Users;
