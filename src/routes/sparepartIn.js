const express = require('express');
const sparepartInController = require('../controllers/sparepartInController.js')
const router = express.Router();

router.get('/', sparepartInController.getSparepartIn);
router.post('/', sparepartInController.newSparepartIn);
router.patch('/:id', sparepartInController.updateSparepartIn)
router.delete('/:id', sparepartInController.deleteSparepartIn)

module.exports = router;