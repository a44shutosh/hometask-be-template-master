// model.js
const { sequelize, Sequelize } = require('./sequelize');
const Profile = require('./profileModel');
const Contract = require('./contractModel');
const Job = require('./jobModel');

// Associations
Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Contract.belongsTo(Profile, { as: 'Contractor', foreignKey: 'ContractorId' });
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
Contract.belongsTo(Profile, { as: 'Client' });
Contract.hasMany(Job);
Job.belongsTo(Contract);

module.exports = {
  sequelize,
  Sequelize,
  Profile,
  Contract,
  Job
};
