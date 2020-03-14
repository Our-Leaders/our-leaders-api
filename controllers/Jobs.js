const _ = require('lodash');
const db = require('./../models');
const Email = require('./../communications/Email');
const EmailUtil = require('./../utils/EmailUtil');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

class Jobs {
  static async retrieveJobListings(req, res, next) {
    const {query, user} = req;
    const {categoryName, type} = query;

    try {
      let query = {
        isArchived: false
      };

      // if the user is authenticated and is an admin, then add in archived jobs
      if (user && ['admin', 'superadmin'].includes(user.role)) {
        query = {};
      }

      if (categoryName) {
        query.category = categoryName;
      }

      if (type) {
        query.type = type;
      }

      const jobs = await db.Job.find(query);
      const groupedJobs = _.groupBy(jobs, 'category');

      res.status(200).send({
        jobs: groupedJobs
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async addJobListing(req, res, next) {
    const {title, description, applicationLink, location, category, type, image} = req.body;

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

  static async applyToJobListing(req, res, next) {
    const {body, params} = req;
    const {jobId} = params;
    const {firstName, lastName, email, address, cv, portfolio, interested, strengths} = body;

    try { 
      const job = await db.Job.findById(jobId);

      if (!job || job.isArchived) {
        return next(new ErrorHandler(404, 'No such position currently exists.'));
      }

      const payload = EmailUtil.getApplicationEmail(job.title, job.description, firstName, lastName, email, address, cv, portfolio, interested, strengths);
      const payloadApplicant = EmailUtil.getApplicationReceivedEmail(job.title, firstName, email);
      await Email.send(payload);
      await Email.send(payloadApplicant);

      res.status(201).send({
        message: 'Application successful.'
      });
    } catch (error) {
      console.log(error);
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

  static async removeCategory(req, res, next) {
    const {categoryName} = req.params;

    try {
      await db.Job.deleteMany({category: categoryName});

      res.status(200).send({
        message: `${categoryName} successfully removed.`
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = Jobs;
