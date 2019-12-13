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

  static async updateJobListing(req, res, next) {
    const {body, params} = req;
    const {jobId} = params;

    try {
      const job = await db.Job.findById(jobId);

      if (!job) {
        return next(new ErrorHandler(404, 'A job listing with the provided id does not.'));
      }

      ['title', 'description', 'location', 'category'].forEach(prop => {
        if (body[prop]) {
          job[prop] = body[prop];
        }
      });

      await job.save();

      res.status(200).send({
        job: OutputFormatters.formatJob(job)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async archiveJobListing(req, res, next) {
    const {params} = req;
    const {jobId} = params;

    try {
      const job = await db.Job.findById(jobId);

      if (!job) {
        return next(new ErrorHandler(404, 'A job listing with the provided id does not.'));
      }

      job.isArchived = true;
      await job.save();

      res.status(200).send({
        job: OutputFormatters.formatJob(job)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async unarchiveJobListing(req, res, next) {
    const {params} = req;
    const {jobId} = params;

    try {
      const job = await db.Job.findById(jobId);

      if (!job) {
        return next(new ErrorHandler(404, 'A job listing with the provided id does not.'));
      }

      job.isArchived = false;
      await job.save();

      res.status(200).send({
        job: OutputFormatters.formatJob(job)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Jobs;
