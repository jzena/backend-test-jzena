const { Op } = require('sequelize');

const getContractById = async (req) => {
  const { Contract } = req.app.get('models');
  const { id: profileId } = req.profile;
  const { id } = req.params
  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });
  return contract;
};

const getLiveContractsByUser = async (req) => {
  const { Contract } = req.app.get('models');
  const { id: profileId } = req.profile;
  //Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.◊
  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      status: {
        [Op.ne]: 'terminated',
      },
    },
  });
  return contracts;
};


module.exports = {
  getContractById,
  getLiveContractsByUser
};