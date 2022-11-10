const httpStatus = require('http-status');

const AdminService = require('../services/admin');

const getBestProfession = async (req, res) => {
  try {
    const bestProfession = await AdminService.getBestProfession(req);

    if (!bestProfession) {
      res.status(httpStatus.NOT_FOUND).json({ message: 'No best profession found' });
    } else {
      res.status(httpStatus.OK).json(bestProfession);
    }
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error occurred while finding best profession', error });
  }
};

const getBestClients = async (req, res) => {
  try {
    const bestClients = await AdminService.getBestClients(req);

    if (!bestClients) {
      res.status(httpStatus.NOT_FOUND).json({ message: 'No best clients found' });
    } else {
      res.status(httpStatus.OK).json(bestClients);
    }
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error occurred while finding best profession', error });
  }
}

module.exports = {
  getBestProfession,
  getBestClients
};