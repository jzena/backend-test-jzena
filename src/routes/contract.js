const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const { getContractById, getLiveContractsByUser } = require('../controllers/contract');

const contractRouter = express.Router();

contractRouter.get('/',[getProfile], getLiveContractsByUser);
contractRouter.get('/:id', [getProfile], getContractById);

module.exports = contractRouter;