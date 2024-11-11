const express = require('express');
const machineController = require('../controllers/machineController.js')
const router = express.Router();

router.get('/', machineController.getMachines);
router.post('/', machineController.newMachine);
router.patch('/:id', machineController.updateMachine)
router.delete('/:id', machineController.deleteMachine)

module.exports = router;