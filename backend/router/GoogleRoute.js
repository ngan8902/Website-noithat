const express = require('express');
const router = express.Router();
const googleController = require('../controller/GoogleController');

router.post('/google-login', googleController.googleLogin);
// router.post('/upload-google-avatar', googleController.uploadGoogleAvatar);

module.exports = router;
