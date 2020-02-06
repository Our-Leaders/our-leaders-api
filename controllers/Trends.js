const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Trends {
  static async create(req, res, next) {
    const {body} = req;

    try {
      const totalTrends = await db.Trend.countDocuments();
      let trend = await db.Trend.findOne({
        politician: body.politicianId
      });

      // if a trend does not exist, create one
      if (!trend) {
        const nextOrder = totalTrends + 1;
        await resortTrendOrder(nextOrder, body.order);

        trend = new db.Trend({
          politician: body.politicianId,
          order: body.order || nextOrder,
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
      const trends = await db.Trend.find().sort('order').populate('politician');
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

  static async update(req, res, next) {
    const {body, params} = req;
    const {id} = params;
    const {order} = body;

    try {
      const trend = await db.Trend.findById(id);
      const previousOrder = trend.order;

      if (!trend) {
        return next(new ErrorHandler(404, 'Trending politician doesn\'t exist'));
      }

      await resortTrendOrder(previousOrder, order);
      trend.order = order;
      await trend.save();

      res.status(200).send({
        trend: OutputFormatters.formatTrend(trend)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async delete(req, res, next) {
    const {id} = req.params;

    try {
      const trend = await db.Trend.findById(id);
      const totalTrends = await db.Trend.countDocuments();

      if (trend) {
        await db.Trend.findByIdAndDelete(id);
      }
      resortTrendOrder(trend.order, totalTrends + 1);

      res.status(200).send({
        message: 'Trend deleted successfully.'
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async deleteAll(req, res, next) {
    try {
      await db.Trend.deleteMany({});

      res.status(200).send({
        message: 'All trends deleted successfully.'
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

const resortTrendOrder = async(previousOrder, newOrder) => {
  if (newOrder && previousOrder !== newOrder) {
    if (previousOrder > newOrder) {
      await db.Trend.updateMany({order: {$gte: newOrder, $lt: previousOrder}}, {$inc: {order: 1}});
    } else {
      await db.Trend.updateMany({order: {$gt: previousOrder, $lte: newOrder}}, {$inc: {order: -1}});
    }
  }
}

module.exports = Trends;
