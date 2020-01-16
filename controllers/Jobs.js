const db = require('./../models');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Jobs {
  static async retrieveJobListings(req, res, next) {
    const {categoryName, type} = req.params;

    try {
      const query = {
        isArchived: false
      };

      if (categoryName) {
        query.category = categoryName;
      }

      if (type) {
        query.type = type;
      }

      const jobs = await db.Job.find(query);
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async addJobListing(req, res, next) {
    const {title, description, applicationLink, category, type, image} = req.body;

    try {
      const job = new db.Job({
        title,
        description,
        type,
        location,
        category,
        applicationLink,
        image,
        isArchived: false
      });
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

      ['title', 'description', 'location', 'category', 'image'].forEach(prop => {
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
