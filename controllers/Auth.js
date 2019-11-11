/**
 * Created by bolorundurowb on 11/11/2019
 */

const db = require('./../models');
const Logger = require('./../config/Logger');

class Auth {
  static async signUp(req, res) {
    const body = req.body;

    try {
      let user;

      // if the email address is provided, then use that
      if (body.email) {
        user = new db.User({
          firstName : body.firstName,
          lastName: body.lastName,
          email: body.email,
          password: body.password
        });
      }
    } catch (err) {
      Logger.error(err);
      res.status(500).send({
        message: 'An error occurred.'
      });
    }
  }
}

module.exports = Auth;
