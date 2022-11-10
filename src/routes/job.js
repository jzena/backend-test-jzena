const express = require('express');
const { getUnpaidJobs, postPayByJobId } = require('../controllers/job');
const { getProfile } = require('../middleware/getProfile');

const jobRoutes = express.Router();

jobRoutes.get('/unpaid', [getProfile], getUnpaidJobs);
jobRoutes.post('/:job_id/pay', [getProfile], postPayByJobId);

module.exports = jobRoutes;