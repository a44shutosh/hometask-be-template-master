const express = require('express');
const { bestProfessionController, bestClientsController } = require('../controllers/adminController');

const router = express.Router();

// Route for best profession
router.get('/best-profession', bestProfessionController);
// Route for best clients
router.get('/best-clients', bestClientsController);
module.exports = router;
