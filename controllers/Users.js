/**
 * Created by bolorundurowb on 11/12/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');
const Imageutil = require('../utils/ImageUtil');
const OutputFormatters = require('./../utils/OutputFormatters');

class Users {
  static async getUsers(req, res, next) {
    try {
      let {sort, limit, skip} = req.params;

      const users = await db.User
        .find({})
        .skip(skip)
        .limit(limit)
        .sort(sort || 'firstName'); // default to ordering by first name

      res.status(200).send({
        users: users.map(x => OutputFormatters.formatUser(x))
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.'));
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
          await Imageutil.deleteFile(user.profileImage.publicId);
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
      next(new ErrorHandler(500, 'An error occurred.'));
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
      next(new ErrorHandler(500, 'An error occurred.'));
    }
  }

  static async getVotes(req, res, next) {
    const {id} = req.user;

    try {
      const politicians = await db.Politician
        .find({
          rooms: {
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
      next(new ErrorHandler(500, 'An error occurred.'));
    }
  }

  static async deleteAccount(req, res, next) {
    const {userId} = req.params;

    try {
      const user = await db.User.findById(userId);

      if (!user) {
        return next(new ErrorHandler(404, 'A user with the provided id does not exist.'));
      }

      user.isDeleted = true;
      await user.save();

      res.status(200).send({
        message: 'User account successfully deleted.'
      });
    } catch (err) {
      next(new ErrorHandler(500, 'An error occurred.'));
    }
  }
}

module.exports = Users;
