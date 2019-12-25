/**
 * Created by bolorundurowb on 14/11/2019
 */

const db = require('./../models');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Pages {
  static async getPages(req, res, next) {
    try {
      const page = await db.Page.findOne({});

      if (!page) {
        next(new ErrorHandler(404, 'Web pages info was not found.'));
      }

      res.status(200).send({
        page: {
          aboutUs: page.aboutUs,
          contact: page.contact,
          socials: page.socials
        }
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Pages;
