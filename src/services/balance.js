const { Op } = require('sequelize');

const postBalanceDepositByClientId = async (req) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { id: clientId, balance, type } = req.profile;
  const { userId } = req.params;
  const sequelize = req.app.get('sequelize');

  //Deposits money into the the the balance of a client, 
  //a client can’t deposit more than 25% his total of jobs to pay. 
  //(at the deposit moment)
  let response = '';
  const jobs = await Job.findAll({
    include: [
      {
        model: Contract,
        where: { status: 'in_progress', ClientId: userId },
      },
    ],
  });
  
  if (jobs.length > 0 && type == 'client') {
    let totalJobstoPay = 0
    jobs.forEach(item => {
      totalJobstoPay += Number(item.dataValues.price)
    });
    const totalToDeposit = totalJobstoPay * .25
    try {
      await Profile.update(
        { balance: sequelize.literal(`balance + ${ totalToDeposit }`) },
        { where: { id: userId } },
      )
      response = `Desposit of ${ totalToDeposit } for clientId ${ userId } has been made successfully.`;
    } catch (error) {
      response = `Desposit of ${ amountToPay } for clientId ${ userId } failed. Please try again.`;
    }
  } else {
    response = `No deposit found for this user`;
  }

  return response;
};

module.exports = {
  postBalanceDepositByClientId,
};