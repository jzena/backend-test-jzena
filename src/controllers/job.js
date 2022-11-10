const httpStatus = require('http-status');

const JobService = require('../services/job');

const getUnpaidJobs = async (req, res) => {
  try {
    const unpaidJobs = await JobService.getUnpaidJobs(req);
    if (!unpaidJobs) {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else {
      res
        .status(httpStatus.OK)
        .json(unpaidJobs);
    }
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error });
  }
};

const postPayByJobId = async (req, res) => {
  try {
    const response = await JobService.postPayByJobId(req);
    if (response == '') {
      res.status(httpStatus.NOT_FOUND).json({ message: `Job not found` });

    } else if (typeof response === 'string' && response.includes('No paid found for this job')) {
      res.status(httpStatus.CONFLICT).json({ message: `No paid found for this job` });
      
    } else {
      res.status(httpStatus.OK).json({ message: response });
    }

  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error occurred while paying for a job. Please contac the service administrator', error });
  }
};

module.exports = {
  getUnpaidJobs,
  postPayByJobId,
};