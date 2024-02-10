const { getNonTerminatedContracts, getContractByIdService } = require('../services/contractService');

const getContracts = async (req, res) => {
  const profileId = req.headers.profile_id;

  try {
    const contracts = await getNonTerminatedContracts(profileId);

    if (contracts.length === 0) {
      return res.status(404).json({ message: 'No non-terminated contracts found for the user.' });
    }

    return res.status(200).json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getContractById = async (req, res) => {
  const profileId = req.headers.profile_id;
  const contractId = req.params.id;

  try {
    const contract = await getContractByIdService(profileId, contractId);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found or does not belong to the user.' });
    }

    return res.status(200).json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getContracts, getContractById };
