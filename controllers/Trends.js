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

  static async getTrendingPoliticians(req, res, next) {
    try {
      const trendingPoliticiansLimit = 10; // This is just an arbitrary number, can be changed later or added to future settings
      const trends = await db.Trend.find().populate('politician');
      let trendingPoliticians = [];

      if (trends.length < trendingPoliticiansLimit) {
        let trendingPoliticianIds = [];
        trends.forEach(trend => {
          trendingPoliticianIds.push(trend.politician.id);
          trendingPoliticians.push(trend.politician);
        });

        const mostViewed = await db.Politician
          .find({_id: {$nin: trendingPoliticianIds}})
          .sort('-numberOfViews')
          .limit(trendingPoliticiansLimit - trends.length);

        trendingPoliticians = trendingPoliticians.concat(mostViewed);
      }

      const serializedPoliticians = trendingPoliticians.map(politician => {
        return OutputFormatters.formatPolitician(politician);
      });
      res.status(200).send({
        trendingPoliticians: serializedPoliticians
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Trends;
