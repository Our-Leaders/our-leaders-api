/**
 * Created by bolorundurowb on 11/11/2019
 */

const db = require('./../models');
const GoogleUtil = require('./../utils/GoogleUtil');
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
      } else if (body.googleId) {
        const response = await GoogleUtil.verifyToken(body.googleId);
        user = new db.User({
          googleId: response.sub,
          email: response.email
        });

        // split the name provided by Google into first and last name
        const nameParts = response.name.split(' ', 2);
        if (nameParts.length > 0) {
          user.firstName = nameParts[0];
        }

        if (nameParts.length > 1) {
          user.lastName = nameParts[1];
        }
      } else if (body.facebookId) {

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
