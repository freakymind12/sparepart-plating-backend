const express = require('express');
const categoryController = require('../controllers/categoryController.js')
const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', categoryController.newCategory);
router.patch('/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)

module.exports = router;