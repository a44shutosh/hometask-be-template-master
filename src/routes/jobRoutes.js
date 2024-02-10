// jobRoutes.js
const express = require('express');
const { getProfile } = require('../middlewares/getProfile');
const { getUnpaidJobsController, payForJobController } = require('../controllers/jobController');

const router = express.Router();

router.get('/unpaid', getProfile, getUnpaidJobsController);
// Pay for a job
router.post('/:job_id/pay', getProfile, payForJobController);

module.exports = router;
