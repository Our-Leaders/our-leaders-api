/**
 * Created by bolorundurowb on 13/11/2019
 */

const jwt = require('jsonwebtoken');

class AuthenticationMiddleware {
  static async authenticate(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers['Authorization'];
    if (!token) {
      return res.status(401).send({
        message: 'An authentication token in the header is required.'
      });
    }

    try {

    }
  }
}
