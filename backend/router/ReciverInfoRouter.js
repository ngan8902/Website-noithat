const express = require("express");
const router = express.Router();
const ReciverInfoController = require('../controller/ReciverInfoController') 

router.post('/save-new-address', ReciverInfoController.saveNewAddress)

module.exports = router