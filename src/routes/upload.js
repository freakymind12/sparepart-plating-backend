const express = require('express');
const getMulterConfig = require('../config/multerconfig')
const uploadController = require('../controllers/uploadController')
const router = express.Router();

// arg 1 file path 
// arg 2 file name
const config = getMulterConfig('uploads/sparepart-drawing', 'ds')

router.post('/', config.single('file'), uploadController.uploadFile, uploadController.handleFileUploadError)
router.patch('/:id', config.single('file'), uploadController.updateDrawingSparepart, uploadController.handleFileUploadError)

module.exports = router;