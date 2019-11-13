/**
 * Created by bolorundurowb on 13/11/2019
 */

const jwt = require('jsonwebtoken');
const Config = require('./../config/Config');
const Logger = require('./../config/Logger');

class AuthenticationMiddleware {
  static async authenticate(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers['Authorization'];
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
    if (req.user.role === 'super' || req.user.role === 'admin') {
      next();
    } else {
      res.status(403).send({
        message: 'You lack necessary permissions to carry out this action.'
      });
    }
  }

  static async isSuperAdmin(req, res, next) {
    if (req.user.role === 'super') {
      next();
    } else {
      res.status(403).send({
        message: 'You lack necessary permissions to carry out this action.'
      });
    }
  }
}

module.exports = AuthenticationMiddleware;