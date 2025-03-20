const express = require('express');
const router = express.Router();
const googleController = require('../controller/GoogleController');

router.post('/google-login', googleController.googleLogin);

module.exports = router;
