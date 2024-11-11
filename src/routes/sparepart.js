const express = require('express');
const sparepartController = require('../controllers/sparepartController.js')
const router = express.Router();

router.get('/', sparepartController.getSpareparts);
router.get('/oos', sparepartController.getOutOfStock);
router.get('/report', sparepartController.getYearlyReportSparepart);
router.post('/', sparepartController.newSparepart);
router.patch('/:id', sparepartController.updateSparepart)
router.delete('/:id', sparepartController.deleteSparepart)

module.exports = router;