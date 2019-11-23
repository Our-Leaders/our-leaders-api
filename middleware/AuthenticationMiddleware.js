/**
 * Created by bolorundurowb on 13/11/2019
 */

const jwt = require('jsonwebtoken');
const Config = require('./../config/Config');
const Logger = require('./../config/Logger');
const { ErrorHandler } = require('./../utils/errorUtil');
const { User } = require('./../models');

class AuthenticationMiddleware {
  static async authenticate(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
      return res.status(401).send({
        message: 'An authentication token in the header is required.'
      });
    }

    try {
      const decoded = await jwt.verify(token, Config.secret);
      if (!decoded) {
        return res.status(401).send({
          message: 'The token provided was invalid or expired. Please login again.'
        });
      } else {
        req.user = decoded;
        next();
      }
    } catch (err) {
      Logger.error(err);
      res.status(500).send({
        message: err.message || JSON.stringify(err)
      });
    }
  }

  static async isAdmin(req, res, next) {
    if (req.user.role === 'superadmin' || req.user.role === 'admin') {
      next();
    } else {
      res.status(403).send({
        message: 'You lack necessary permissions to carry out this action.'
      });
    }
  }

  static async isSuperAdmin(req, res, next) {
    if (req.user.role === 'superadmin') {
      next();
    } else {
      res.status(403).send({
        message: 'You lack necessary permissions to carry out this action.'
      });
    }
  }

  // I feel we should have a more robust check for permissions for this
  static hasPermission({ property, action }) {
    return async function (req, res, next) {
      const { user } = req;
      const { permissions = {}, id } = user;
      const propertyPermissionObject = permissions[property];

      if (propertyPermissionObject[action]) {
        next();
      } else {
        next(new ErrorHandler(403, 'You do not have sufficient priviledges to carry out this action.'));
      }
    };
  }
}

module.exports = AuthenticationMiddleware;
