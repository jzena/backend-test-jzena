const httpStatus = require('http-status');
const balanceService = require('../services/balance');

const postBalanceDepositByClientId = async (req, res) => {
  try {
    const response = await balanceService.postBalanceDepositByClientId(req);
    if (response == '') {
      res.status(httpStatus.NOT_FOUND).json({ message: `balance not found` });

    } else if (typeof response === 'string' && response.includes('No deposit found for this user')) {
      res.status(httpStatus.CONFLICT).json({ message: `No deposit found for this user` });
      
    } else {
      res.status(httpStatus.OK).json({ message: response });
    }

  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error occurred while deposit for a user. Please contac the service administrator', error });
  }
};

module.exports = {
  postBalanceDepositByClientId,
};