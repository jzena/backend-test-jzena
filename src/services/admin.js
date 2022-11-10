const { Op, QueryTypes } = require('sequelize');

const getBestProfession = async (req) => {
  const sequelize = req.app.get('sequelize');
  const { start: startDate, end: endDate } = req.query;

  // NOTE: when using Replacements its safe (no SQL injections risk)
  const [bestProfession] = await sequelize.query(`
  SELECT p.profession, 
         SUM(j.price) as earned
  FROM Profiles p
       INNER join Contracts c on p.id     = c.ContractorId
       INNER join Jobs j on j.ContractId  = c.id
  WHERE p.type = :contractorType
  AND   j.paymentDate between :startDate AND :endDate
  GROUP BY p.profession 
  ORDER BY SUM(j.price) DESC
  LIMIT 1
  `, {
    replacements: {
      contractorType: "contractor",
      startDate,
      endDate
    },
    type: QueryTypes.SELECT
  })

  return bestProfession;
};

const getBestClients = async (req) => {
  const sequelize = req.app.get('sequelize');
  const { Job, Contract, Profile } = req.app.get('models');
  const { start: startDate, end: endDate, limit } = req.query;

  // NOTE: when using Replacements its safe (no SQL injections risk)
  const bestClients = await sequelize.query(`
    SELECT p.id
          ,p.firstName || ' ' || p.lastName as fullName
          ,SUM(j.price) as paid
    FROM Profiles p
        INNER join Contracts c on p.id     = c.ClientId
        INNER join Jobs j on j.ContractId  = c.id
    WHERE p.type = :contractorType
    AND   j.paymentDate between :startDate AND :endDate
    GROUP BY p.profession 
    ORDER BY SUM(j.price) DESC
    LIMIT :limit
    `, {
    replacements: {
      contractorType: "client",
      startDate,
      endDate,
      limit: limit || 2
    },
    type: QueryTypes.SELECT
  })

  return bestClients
}

module.exports = {
  getBestProfession,
  getBestClients
};