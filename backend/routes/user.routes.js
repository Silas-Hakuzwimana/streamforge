const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/user.controller');
const upload  = require('../middlewares/multer.middleware');

// -------------------- Routes --------------------
router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, upload.single('profilePic'), updateProfile);
router.put('/change-password', authenticate, changePassword);
router.delete('/me', authenticate, deleteAccount);

module.exports = router;
