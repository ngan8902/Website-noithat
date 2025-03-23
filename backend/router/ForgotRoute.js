const express = require('express');
const router = express.Router();
const fogotController = require('../controller/ForgotController');

router.post('/forgot-password', fogotController.sendOTP);
router.post('/verify-otp', fogotController.verifyOTP)
router.post('/reset-password', fogotController.resetPassword)

module.exports = router;