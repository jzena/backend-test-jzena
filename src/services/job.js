const { Op } = require('sequelize');

const getUnpaidJobs = async (req) => {
  const { Job, Contract } = req.app.get('models');
  const { id: profileId } = req.profile;

  // Get all unpaid jobs for a user (either a client or contractor), for active contracts only.
  const unpaidJobs = await Job.findAll({
    include: [
      {
        attributes: [],
        model: Contract,
        required: true,
        where: {
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
          status: {
            [Op.eq]: 'in_progress',
          },
        },
      },
    ],
    where: {
      [Op.or]: [
        { paid: false },
        { paid: null },
      ],
    },
  });

  return unpaidJobs;
};

const postPayByJobId = async (req) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { id: clientId, balance, type } = req.profile;
  const jobId = req.params.job_id;
  const sequelize = req.app.get('sequelize');

  //Pay for a job, a client can only pay if his balance >= the amount to pay. 
  //The amount should be moved from the client’s balance to the contractor balance.

  let response = '';
  const job = await Job.findOne({
    where: { id: jobId, paid: { [Op.is]: null } },
    include: [
      {
        model: Contract,
        where: { status: 'in_progress', ClientId: clientId },
      },
    ],
  });
  if (job && type == 'client') {
    const amountToPay = job.price;
    const contractorId = job.Contract.ContractorId;

    //key rule
    if (balance >= amountToPay) {
      const paymentTransaction = await sequelize.transaction();
      try {
        //1. Update balance from Client
        //2. Update balance from contractor
        //3. Update Job paymentDate
        await Promise.all([
          Profile.update(
            { balance: sequelize.literal(`balance - ${ amountToPay }`) },
            { where: { id: clientId } },
            { transaction: paymentTransaction },
          ),

          Profile.update(
            { balance: sequelize.literal(`balance + ${ amountToPay }`) },
            { where: { id: contractorId } },
            { transaction: paymentTransaction },
          ),

          Job.update(
            {
              paid: 1,
              paymentDate: new Date()
            },
            { where: { id: jobId } },
            { transaction: paymentTransaction },
          ),
        ]);

        await paymentTransaction.commit();

        response = `Payment of ${ amountToPay } for ${ job.description } has been made successfully.`;
      } catch (error) {
        await paymentTransaction.rollback();

        response = `Payment of ${ amountToPay } for ${ job.description } failed. Please try again.`;
      }
    }

  } else {
    response = `No paid found for this job`;
  }

  return response;
};

module.exports = {
  getUnpaidJobs,
  postPayByJobId,
};