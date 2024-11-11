const express = require('express');
const supplierController = require('../controllers/supplierController.js')
const router = express.Router();

router.get('/', supplierController.getSuppliers);
router.post('/', supplierController.newSupplier);
router.patch('/:id', supplierController.updateSupplier)
router.delete('/:id', supplierController.deleteSupplier)

module.exports = router;