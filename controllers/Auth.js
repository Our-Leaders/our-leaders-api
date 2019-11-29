/**
 * Created by bolorundurowb on 11/11/2019
 */

const jwt = require('jsonwebtoken');
const bcryptJs = require('bcryptjs');

const db = require('./../models');
const Config = require('./../config/Config');
const CodeUtil = require('./../utils/CodeUtil');
const FacebookUtil = require('./../utils/FacebookUtil');
const GoogleUtil = require('./../utils/GoogleUtil');
const OutputFormatters = require('./../utils/OutputFormatters');
const Sms = require('./../communications/Sms');
const { ErrorHandler } = require('../utils/ErrorUtil');

class Auth {
  static async signUp(req, res, next) {
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
          email: response.email,
          isEmailVerified: true
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
          gender: response.gender,
          isEmailVerified: true
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
          message: 'A user with the provided user profile already exists.'
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
      next(new ErrorHandler(500, 'An error occurred.'));
    }
  }

  static async login(req, res, next) {
    const { body } = req;
    const { email, password, googleId, facebookId } = body;
    let user;

    try {
      if (email) {
        // check for an existing user
        user = await db.User.findOne({
          email
        });
  
        if (!user) {
          return res.status(400).send({
            message: 'Wrong email or password',
          });
        }
  
        if (!bcryptJs.compareSync(password, user.password)) {
          return res.status(400).send({
            message: 'Wrong email or password',
          });
        }
      } else if (googleId) {
        const { sub, email } = await GoogleUtil.verifyToken(googleId);

        // check for an existing user
        user = await db.User.findOne({
          email,
          googleId: sub,
        });

        if (!user) {
          return res.status(400).send({
            message: 'There is no user associated with this account',
          });
        }
      } else if (facebookId) {
        const { id, email } = await FacebookUtil.verifyToken(facebookId);

        // check for an existing user
        // using id here instead of email because
        // user email can change on facebook but id doesn't
        user = await db.User.findOne({
          facebookId: id,
        });

        if (!user) {
          return res.status(400).send({
            message: 'There is no user associated with this account',
          });
        }

        // update email if the email is different
        if (user.email.toLowerCase() !== email.toLowerCase()) {
          user.email = email;
          await user.save();
        }
      }

      res.status(200).send({
        user: OutputFormatters.formatUser(user),
        token: Auth.tokenify(user)
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.'));
    }
  }

  static async sendVerificationCode(req, res, next) {
    const { phoneNumber } = req.query;
    const userId = req.user.id;

    try {
      const user = await db.User.findById(userId);

      if (!user) {
        return res.status(404).send({
          message: 'This user does not exist.',
        });
      }

      if (user.isPhoneVerified) {
        return res.status(200).send({
          message: 'Your phone number has already been verified.',
        });
      }

      const verificationCode = CodeUtil.generatePhoneVerificationCode();
      const formattedNumber = OutputFormatters.formatPhoneNumber(phoneNumber);
      
      await Sms.sendMessage(formattedNumber, `Welcome! Your OTP is ${verificationCode}`);

      user.phoneNumber = formattedNumber;
      user.verificationCode = verificationCode;

      await user.save();

      res.status(200).send({
        user: OutputFormatters.formatUser(user)
      });
    } catch(err) {
      next(new ErrorHandler(500, 'An error occurred.'));
    }
  }

  static async verifyCode(req, res, next) {
    const { verificationCode } = req.body;
    const userId = req.user.id;

    try {
      const user = await db.User.findById(userId);

      if (!user) {
        return res.status(404).send({
          message: 'This user does not exist.',
        });
      }

      if (verificationCode !== user.verificationCode) {
        return res.status(400).send({
          message: 'Invalid verification code.',
        });
      }

      user.isPhoneVerified = true;

      await user.save();

      res.status(200).send({
        user: OutputFormatters.formatUser(user)
      });
    } catch(err) {
      next(new ErrorHandler(500, 'An error occurred.'));
    }
  }

  static tokenify(user) {
    return jwt.sign({
      id: user._id,
      role: user.role,
      permissions: user.permissions || {},
    }, Config.secret, {
      expiresIn: '24h'
    });
  }
}

module.exports = Auth;
