const { getBestProfession, getBestClients } = require('../services/adminService');

const bestProfessionController = async (req, res) => {
    try {
        const { start, end } = req.query;

        const bestProfession = await getBestProfession(start, end);

        if (!bestProfession) {
            return res.status(404).json({ error: 'No data found for the given time range.' });
        }

        res.status(200).json({ bestProfession });
    } catch (error) {
        console.error('Error processing best profession request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const bestClientsController = async (req, res) => {
    try {
        const { start, end, limit } = req.query;
        const result = await getBestClients(start, end, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting best clients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    bestProfessionController,
    bestClientsController
};
