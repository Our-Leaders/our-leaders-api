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

  static async updatePages(req, res, next) {
    const {body} = req;
    console.log(body);

    try {
      const page = await db.Page.findOne({});

      if (!page) {
        next(new ErrorHandler(404, 'Web pages info was not found.'));
      }

      ['aboutUs', 'contact', 'socials'].forEach(prop => {
        if (body[prop]) {
          page[prop] = prop;
        }
      });

      await page.save();

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
