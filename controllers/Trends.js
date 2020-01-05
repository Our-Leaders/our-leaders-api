const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Trends {
  static async create(req, res, next) {
    const {body} = req;

    try {
      let totalTrends = await db.Trend.countDocuments();
      let trend = await db.Trend.findOne({
        politician: body.politicianId
      });

      // if a trend does not exist, create one
      if (!trend) {
        trend = new db.Trend({
          politician: body.politicianId,
          order: body.order || totalTrends + 1,
        });
        await trend.save();
      }

      res.status(200).send({
        message: 'Trend created successfully.',
        trend: OutputFormatters.formatTrend(trend)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async get(req, res, next) {
    try {
      const trends = await db.Trend.find().populate('politician');

      const serializedTrends = trends.map(trend => {
        return OutputFormatters.formatTrend(trend);
      });

      res.status(200).send({
        trends: serializedTrends
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Trends;
