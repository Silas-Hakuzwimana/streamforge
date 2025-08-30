const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const uploadMedia = require('../controllers/upload.controller')
const { download, getHistory } = require('../controllers/download.controller');

const upload = require('../middlewares/multer.middleware')

// Upload route
router.post('/upload', authenticate, upload.single('file'), uploadMedia);

// Download route
router.post('/download', authenticate, download);

// Media history (uploads + downloads)
router.get('/history', authenticate, getHistory);

module.exports = router;
