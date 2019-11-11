/**
 * Created by bolorundurowb on 11/11/2019
 */

const jwt = require('jsonwebtoken');

const db = require('./../models');
const Config = require('./../config/Config');
const FacebookUtil = require('./../utils/FacebookUtil');
const GoogleUtil = require('./../utils/GoogleUtil');
const Logger = require('./../config/Logger');
const OutputFormatters = require('./../utils/OutputFormatters');

class Auth {
  static async signUp(req, res) {
    const body = req.body;

    try {
      let user;

      // if the email address is provided, then use that
      if (body.email) {
        user = new db.User({
          firstName: body.firstName,
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
        const response = await FacebookUtil.verifyToken(body.facebookId);
        user = new db.User({
          facebookId: response.id,
          email: response.email,
          firstName: response.first_name,
          lastName: response.last_name,
          gender: response.gender
        });
      }

      // check to see if the user object has been initialized
      if (!user) {
        throw new Error('The user object was not initialized. API payload: ' + JSON.stringify(body));
      }

      // check for an existing user
      const existingUser = await db.User.findOne({
        email: user.email
      });

      if (existingUser) {
        return res.status(409).send({
          message: 'A user with the provided user already exists.'
        });
      }

      // persist new user
      await user.save();

      // TODO: if user is signing up with email and password, send verification email

      res.status(200).send({
        user: OutputFormatters.formatUser(user),
        token: Auth.tokenify(user)
      });
    } catch (err) {
      Logger.error(err);
      res.status(500).send({
        message: 'An error occurred.'
      });
    }
  }


  static tokenify(user) {
    return jwt.sign({
      id: user._id,
      role: user.role
    }, Config.secret, {
      expiresIn: '24h'
    });
  }
}

module.exports = Auth;
