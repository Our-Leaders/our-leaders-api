const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Jobs {
  static async addJobListing(req, res, next) {
    const {body} = req;

    try {
      const job = new db.Job(body);
      await job.save();

      res.status(201).send({
        job: OutputFormatters.formatJob(job)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Jobs;
