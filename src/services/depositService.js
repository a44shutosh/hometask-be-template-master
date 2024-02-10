const { Profile, Contract, sequelize, Job } = require('../models/model');
const { Op } = require('sequelize');

const calculateAmountToPay = async (userId) => {
    try {
        const clientProfile = await Profile.findOne({ where: { id: userId, type: 'client' } });

        if (!clientProfile) {
            return null;
        }

        const activeContracts = await Contract.findAll({
            where: {
                clientId: clientProfile.id,
                status: 'in_progress',
            },
            include: [
                {
                    model: Job,
                    where: {
                        [Op.or]: [
                            { paid: false },
                            { paid: null },
                        ],
                    },
                },
            ],
        });


        if (activeContracts.length === 0) {
            return null;
        }

        const totalAmountToPay = activeContracts.reduce(
            (sum, contract) => sum + contract.Jobs.reduce((jobSum, job) => jobSum + job.price, 0),
            0
        );

        return totalAmountToPay;
    } catch (error) {
        console.error('Error calculating amount to pay:', error);
        throw error;
    }
};


const depositIntoBalance = async (clientProfile, amount) => {
    try {
        await sequelize.transaction(async (t) => {
            await clientProfile.update({ balance: clientProfile.balance + amount }, { transaction: t });
        });
    } catch (error) {
        console.error('Error depositing into balance:', error);
        throw error;
    }
};

module.exports = { calculateAmountToPay, depositIntoBalance };
