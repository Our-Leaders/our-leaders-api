/**
 * Created by bolorundurowb on 11/12/2019
 */

const bcryptJs = require('bcryptjs');

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');
const ImageUtil = require('../utils/ImageUtil');
const OutputFormatters = require('./../utils/OutputFormatters');

class Users {
  static async getUsers(req, res, next) {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 18;

    let {sort, isDeleted, isBlocked} = req.query;

    let query = {
      role: 'user'
    };

    if (isDeleted) {
      query['isDeleted'] = isDeleted;
    }

    if (isBlocked) {
      query.isBlocked = isBlocked;
    }

    try {
      const users = await db.User
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort(sort || 'firstName'); // default to ordering by first name

      const total = await db.User.count(query);

      res.status(200).send({
        users: users.map(x => OutputFormatters.formatUser(x)),
        total
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.', err));
    }
  }

  static async getUserStats(req, res, next) {
    let query = {
      role: 'user'
    };

    try {
      const [total, active, inactive] = await Promise.all([
        db.User.count(query),
        db.User.count({...query, isDeleted: false, isBlocked: false}),
        db.User.count({...query, isDeleted: true})
      ]);

      res.status(200).send({
        total,
        active,
        inactive
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.', err));
    }
  }

  static async updateUser(req, res, next) {
    const {params, user: currentUser, body} = req;
    const {userId} = params;

    try {
      // if the caller is an admin with user update permissions then proceed, else check to see if the owner is making the call
      if (!((currentUser.role === 'superadmin' || currentUser.role === 'admin') && currentUser.permissions['users']['update'])) {
        if (currentUser.id !== userId) {
          return next(new ErrorHandler(403, 'Only the account owner or an authorized admin can update a users profile.'));
        }
      }

      const user =  await db.User.findById(userId);

      if (!user) {
        return next(new ErrorHandler(404, 'User doesn\'t exist'));
      }

      ['firstName', 'lastName', 'gender', 'ageRange'].forEach(prop => {
        if (body[prop]) {
          user[prop] = body[prop];
        }
      });

      if (body.image) {
        if (user.profileImage) {
          await ImageUtil.deleteFile(user.profileImage.publicId);
        }
        user.profileImage = body.image;
      }

      await user.save();

      return res.status(200).send({
        user: OutputFormatters.formatUser(user)
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.'))
    }
  }

  static async blockUser(req, res, next) {
    const {userId} = req.params;

    try {
      const user = await db.User.findById(userId);

      if (!user) {
        return next(new ErrorHandler(404, 'A user with the provided id does not exist.'));
      }

      user.isBlocked = true;
      await user.save();

      res.status(200).send({
        user: OutputFormatters.formatUser(user)
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.', err));
    }
  }

  static async unblockUser(req, res, next) {
    const {userId} = req.params;

    try {
      const user = await db.User.findById(userId);

      if (!user) {
        return next(new ErrorHandler(404, 'A user with the provided id does not exist.'));
      }

      user.isBlocked = false;
      await user.save();

      res.status(200).send({
        user: OutputFormatters.formatUser(user)
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.', err));
    }
  }

  static async getVotes(req, res, next) {
    const {id} = req.user;

    try {
      const politicians = await db.Politician
        .find({
          voters: {
            $elemMatch: {
              id: id
            }
          }
        })
        .select('_id name vote voters politicalBackground');

      res.status(200).send({
        votes: politicians.map(x => {
          const response = {
            politicianId: x._id,
            name: x.name,
            vote: x.vote,
            voters: x.voters
          };

          if (x.politicalBackground[0]) {
            response.position = x.politicalBackground[0].position
          }

          return response;
        })
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.', err));
    }
  }

  static async deleteAccount(req, res, next) {
    const {params, user: currentUser, body} = req;
    const {userId} = params;
    const {password} = body;

    try {
      const user = await db.User.findById(userId);

      if (!user) {
        return next(new ErrorHandler(404, 'A user with the provided id does not exist.'));
      }

      if (currentUser.role === 'user' && !bcryptJs.compareSync(password, user.password)) {
        return res.status(400).send({
          message: 'Password is incorrect',
        });
      }

      user.isDeleted = true;
      await user.save();

      res.status(200).send({
        message: 'User account successfully deleted.'
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.', err));
    }
  }
}

module.exports = Users;
