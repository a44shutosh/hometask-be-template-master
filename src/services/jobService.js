const { sequelize, Job, Contract, Profile } = require('../models/model');
const { Op } = require('sequelize');

/**
 * Service function to get all unpaid jobs for a user.
 * @param {Profile} profile - The authenticated profile
 * @returns {Promise<Array<Job>>} - A promise that resolves to an array of unpaid jobs
 */
const getUnpaidJobs = async (profile) => {
  try {
    const unpaidJobs = await Job.findAll({
      where: {
        paid: {
          [Op.or]: [false, null],
        },
      },
      include: [
        {
          model: Contract,
          where: {
            [Op.or]: [
              { clientId: profile.id },
              { contractorId: profile.id },
            ],
            status: 'in_progress',
          },
        },
      ],
    });

    return unpaidJobs;
  } catch (error) {
    console.error('Error fetching unpaid jobs:', error);
    throw error;
  }
};

/**
 * Service function to pay for a job.
 * @param {Job} job - The job to be paid for
 * @param {Profile} clientProfile - The client profile making the payment
 * @returns {Promise<void>} - A promise that resolves when the payment is successful
 */
const payForJob = async (job, clientProfile) => {
  try {
    if (job.paid) {
      const alreadyPaidError = new Error('The job has already been paid.');
      alreadyPaidError.statusCode = 400;
      throw alreadyPaidError;
    }

    const paymentAmount = job.price;
    if (clientProfile.balance < paymentAmount) {
      const insufficientBalanceError = new Error('Insufficient balance to pay for the job.');
      insufficientBalanceError.statusCode = 400;
      throw insufficientBalanceError;
    }

    await sequelize.transaction(async (t) => {
      await job.update({ paid: true, paymentDate: new Date() }, { transaction: t });

      const contractorProfile = job.Contract.Contractor;
      await clientProfile.update({ balance: clientProfile.balance - paymentAmount }, { transaction: t });
      await contractorProfile.update({ balance: contractorProfile.balance + paymentAmount }, { transaction: t });
    });
  } catch (error) {
    console.error('Error processing payment for job:', error);
    throw { message: error.message, statusCode: error.statusCode || 500 };
  }
};




/**
 * Service function to find a job by id with associated contract and profiles.
 * @param {number} jobId - The id of the job to find
 * @returns {Promise<Job|null>} - A promise that resolves to the found job or null if not found
 */
const findJobByIdWithContractAndProfiles = async (jobId) => {
  try {
    const job = await Job.findByPk(jobId, {
      include: [
        {
          model: Contract,
          include: [
            {
              model: Profile,
              as: 'Client',
            },
            {
              model: Profile,
              as: 'Contractor',
            },
          ],
        },
      ],
    });

    return job;
  } catch (error) {
    console.error('Error finding job by id with contract and profiles:', error);
    throw error;
  }
};

module.exports = {
  getUnpaidJobs,
  payForJob,
  findJobByIdWithContractAndProfiles,
};
