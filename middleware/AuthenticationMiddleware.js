/**
 * Created by bolorundurowb on 13/11/2019
 */

const jwt = require('jsonwebtoken');
const Config = require('./../config/Config');
const Logger = require('./../config/Logger');
const { ErrorHandler } = require('../utils/ErrorUtil');

class AuthenticationMiddleware {
  static async authenticate(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
      return next(ErrorHandler(401, 'An authentication token in the header is required.'));
    }

    try {
      const decoded = await jwt.verify(token, Config.secret);
      if (!decoded) {
        return next(ErrorHandler(401, 'The token provided was invalid or expired. Please login again.'));
      } else {
        req.user = decoded;
        next();
      }
    } catch (err) {
      Logger.error(err);
      return next(ErrorHandler(500, err.message || JSON.stringify(err)));
    }
  }

  static isAdmin(req, res, next) {
    if (req.user.role === 'superadmin' || req.user.role === 'admin') {
      next();
    } else {
      next(ErrorHandler(403, 'You lack necessary permissions to carry out this action.'));
    }
  }

  static isSuperAdmin(req, res, next) {
    if (req.user.role === 'superadmin') {
      next();
    } else {
      next(ErrorHandler(403, 'You lack necessary permissions to carry out this action.'));
    }
  }

  // I feel we should have a more robust check for permissions for this
  static hasPermission({ property, action }) {
    return function (req, res, next) {
      const { user } = req;
      const { permissions = {} } = user;
      const propertyPermissionObject = permissions[property];

      if (propertyPermissionObject[action]) {
        return next();
      } else {
        return next(new ErrorHandler(403, 'You do not have sufficient privileges to carry out this action.'));
      }
    };
  }
}

module.exports = AuthenticationMiddleware;
