const { Profile } = require('../models/model');
const { calculateAmountToPay, depositIntoBalance } = require('../services/depositService');

const depositController = async (req, res) => {
  try {
    const { userId } = req.params;

    const amountToPay = await calculateAmountToPay(userId);

    if (amountToPay === null) {
      return res.status(404).json({ error: 'Client profile not found or no active contracts or payment pending.' });
    }

    const { amount } = req.body;

    if (amount > amountToPay) {
      return res.status(400).json({ error: 'Deposit amount exceeds the maximum allowed.' });
    }

    const clientProfile = await Profile.findOne({ where: { id: userId, type: 'client' } });

    if (!clientProfile) {
      return res.status(404).json({ error: 'Client profile not found.' });
    }

    await depositIntoBalance(clientProfile, amount);

    res.status(200).json({ message: 'Deposit successful.' });
  } catch (error) {
    console.error('Error processing deposit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = depositController;
