const { Sequelize, Contract } = require('../models/model');

const getNonTerminatedContracts = async (profileId) => {
  try {
    const contracts = await Contract.findAll({
      where: {
        [Sequelize.Op.or]: [
          { clientId: profileId },
          { contractorId: profileId },
        ],
        status: { [Sequelize.Op.not]: 'terminated' },
      },
    });

    return contracts || [];
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw new Error('Internal Server Error');
  }
};

const getContractByIdService = async (profileId, contractId) => {
  try {

    const contract = await Contract.findOne({
      where: {
        id: contractId,
        [Sequelize.Op.or]: [
          { clientId: profileId },
          { contractorId: profileId },
        ],
        status: { [Sequelize.Op.not]: 'terminated' },
      },
    });

    return contract;
  } catch (error) {
    console.error('Error fetching contract by ID:', error);
    throw new Error('Internal Server Error');
  }
};

module.exports = { getNonTerminatedContracts, getContractByIdService };
