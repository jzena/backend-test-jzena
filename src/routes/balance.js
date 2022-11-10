const express = require('express');
const { postBalanceDepositByClientId } = require('../controllers/balance');
const { getProfile } = require('../middleware/getProfile');

const balanceRoutes = express.Router();

balanceRoutes.post('/:deposit/:userId', [getProfile], postBalanceDepositByClientId);

module.exports = balanceRoutes;