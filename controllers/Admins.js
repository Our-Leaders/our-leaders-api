/**
 * Created by bolorundurowb on 19/12/2019
 */

const db = require('./../models');
const Email = require('./../communications/Email');
const OutputFormatters = require('./../utils/OutputFormatters');
const StringUtil = require('./../utils/StringUtil');
const EmailUtil = require('./../utils/EmailUtil');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Admins {
  static async findAdmin(req, res, next) {
    try {
      const { isDeleted } = req.query;
      let query = {
        $or: [
          {role: 'superadmin'},
          {role: 'admin'},
        ],
      };

      if (isDeleted) {
        query['isDeleted'] = isDeleted;
      }

      const admins = await db.User
        .find(query)
        .sort({
          firstName: 'asc',
          lastName: 'asc'
        });

      const serializedAdmins = admins.map(admin => OutputFormatters.formatAdmin(admin));

      res.status(200).send({
        admins: serializedAdmins
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async createAdmin(req, res, next) {
    const {firstName, lastName, email, phoneNumber, permissions} = req.body;

    try {
      let admin = await db.User
        .findOne({
          $and: [
            {email: email},
            {$or: [{role: 'admin'}, {role: 'superadmin'}]}
          ]
        });

      if (!admin) {
        admin = new db.User({
          role: 'admin',
          isUsingDefaultPassword: true
        });
      } else if (admin.isDeleted) {
        admin.isDeleted = false;
      } else {
        return next(new ErrorHandler(409, 'A user with the provided email address already exists.'));
      }

      const defaultPassword = StringUtil.generatePassword();

      admin.firstName = firstName;
      admin.lastName = lastName;
      admin.password = defaultPassword;
      admin.email = email;
      admin.phoneNumber = phoneNumber;
      admin.permissions = permissions;
      await admin.save();

      res.status(201).send({
        admin: OutputFormatters.formatAdmin(admin)
      });

      // send invite email with default password
      const payload = EmailUtil.getNewAdminEmail(admin.email, admin.firstName, defaultPassword);
      await Email.send(payload);
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

  static async updateAdminStatus(req, res, next) {
    const {adminId} = req.params;
    const {body} = req;

    try {
      let admin = await db.User
        .findById(adminId);

      if (!admin) {
        return next(new ErrorHandler(404, 'An admin with the provided id does not exist.'));
      }

      admin.isBlocked = body.block;

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

  static async reactivateAdmin(req, res, next) {
    const {adminId} = req.params;

    try {
      const admin = await db.User.findById(adminId);

      if (!admin) {
        return next(new ErrorHandler(409, 'An admin with the provided id does not exist.'));
      }

      admin.isDeleted = false;
      await admin.save();

      res.status(200).send({
        message: 'Admin successfully reactivated.'
      });
    } catch (err) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Admins;
