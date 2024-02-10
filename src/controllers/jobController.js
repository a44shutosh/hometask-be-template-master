const { getUnpaidJobs, findJobByIdWithContractAndProfiles, payForJob } = require('../services/jobService'); // Import the service function
const { Op } = require('sequelize');
const { Job, Contract } = require('../models/model');

/**
 * Controller function to get all unpaid jobs for a user.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getUnpaidJobsController = async (req, res) => {
  try {
    const { profile } = req;

    const unpaidJobs = await getUnpaidJobs(profile);

    res.status(200).json(unpaidJobs);
  } catch (error) {
    console.error('Error fetching unpaid jobs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Controller function to pay for a job.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const payForJobController = async (req, res, next) => {
  try {
    const { profile } = req;
    const { job_id } = req.params;

    const job = await findJobByIdWithContractAndProfiles(job_id);

    if (!job) {
      const notFoundError = new Error('Job not found.');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    if (job.Contract.Client.id !== profile.id) {
      const unauthorizedError = new Error('Unauthorized. You are not the client for this job.');
      unauthorizedError.statusCode = 403;
      throw unauthorizedError;
    }

    await payForJob(job, profile);

    res.status(200).json({ message: 'Payment successful.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUnpaidJobsController,
  payForJobController
};
