const express = require('express');
const router = express.Router();
const MailController = require('../helper/MailHelper');


router.post('/send-mail' , MailController.sendMail)



module.exports = router;
