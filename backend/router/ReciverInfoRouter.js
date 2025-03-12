const express = require("express");
const router = express.Router();
const ReciverInfoController = require('../controller/ReciverInfoController') 

router.post('/save-new-address', ReciverInfoController.saveNewAddress)
router.get('/get-address/:id', ReciverInfoController.getAddress)


module.exports = router