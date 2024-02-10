// routes.js
const express = require('express');
const contractRoutes = require('./contractRoutes');
const jobRoutes = require('./jobRoutes');
const adminRoutes = require('./adminRoutes');
const depositController = require('../controllers/depositController');
// Add other route imports as needed

const router = express.Router();

// Include contract routes
router.use('/contracts', contractRoutes);
router.use('/jobs', jobRoutes);
router.use('/admin', adminRoutes);
// Deposit money into the balance of a client
router.post('/balances/deposit/:userId', depositController);

module.exports = router;
