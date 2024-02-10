// contractRoutes.js
const express = require('express');
const { getProfile } = require('../middlewares/getProfile');
const { getContracts, getContractById } = require('../controllers/contractController');

const router = express.Router();

router.get('/', getProfile, getContracts);
router.get('/:id', getProfile, getContractById);

module.exports = router;
