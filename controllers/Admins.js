/**
 * Created by bolorundurowb on 19/12/2019
 */

const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Admins {
  static async createAdmin(req, res, next) {
    const {firstName, lastName, email, password, phone, permissions} = req.body;

    try {
      let admin = await db.User
        .findOne({email});

      if (admin) {
        return next(new ErrorHandler(409, 'A user with the provided email address already exists.'));
      }

      admin = new db.User({
        firstName,
        lastName,
        email,
        password,
        permissions,
        phoneNumber: phone,
        role: 'admin'
      });
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
}

module.exports = Admins;
