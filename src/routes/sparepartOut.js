const express = require('express');
const sparepartOutController = require('../controllers/sparepartOutController.js')
const router = express.Router();

router.get('/', sparepartOutController.getSparepartOut);
router.get('/report', sparepartOutController.getReportSparepartOut);
router.post('/', sparepartOutController.newSparepartOut);
router.patch('/:id', sparepartOutController.updateSparepartOut)
router.delete('/:id', sparepartOutController.deleteSparepartOut)

module.exports = router;