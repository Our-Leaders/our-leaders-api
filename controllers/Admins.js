/**
 * Created by bolorundurowb on 19/12/2019
 */

const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Admins {
  static async createAdmin(req, res, next) {
    const {firstName, lastName, email, password, phoneNumber, permissions} = req.body;

    try {
      let admin = await db.User
        .findOne({email});

      if (!admin) {
        admin = new db.User({
          role: 'admin'
        });
      } else if (admin.isDeleted) {
        admin.isDeleted = false;
      } else {
        return next(new ErrorHandler(409, 'A user with the provided email address already exists.'));
      }

      admin.firstName = firstName;
      admin.lastName = lastName;
      admin.password = password;
      admin.email = email;
      admin.phoneNumber = phoneNumber;
      admin.permission = permissions;
      await admin.save();

      // TODO: send invite email with default password

      res.status(201).send({
        admin: OutputFormatters.formatAdmin(admin)
      });
    } catch (err) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async updateAdmin(req, res, next) {
    const {adminId} = req.params;
    const {body} = req;

    try {
      let admin = await db.User
        .findById(adminId);

      if (!admin) {
        return next(new ErrorHandler(409, 'An admin with the provided id does not exist.'));
      }

      ['firstName', 'lastName', 'email', 'permissions', 'phoneNumber'].forEach(prop => {
        if (body[prop]) {
          admin[prop] = body[prop];
        }
      });
      await admin.save();

      res.status(200).send({
        admin: OutputFormatters.formatAdmin(admin)
      });
    } catch (err) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async deleteAdmin(req, res, next) {
    const {adminId} = req.params;

    try {
      const admin = await db.User.findById(adminId);

      if (!admin) {
        return next(new ErrorHandler(409, 'An admin with the provided id does not exist.'));
      }

      admin.isDeleted = true;
      await admin.save();

      res.status(200).send({
        message: 'Admin successfully deleted.'
      });
    } catch (err) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Admins;
