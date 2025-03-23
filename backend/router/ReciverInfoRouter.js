const express = require("express");
const router = express.Router();
const ReciverInfoController = require('../controller/ReciverInfoController') 

router.post('/save-new-address', ReciverInfoController.saveNewAddress)
router.get('/get-address/:userId', ReciverInfoController.getAddress)
router.put("/set-default-address", ReciverInfoController.setDefaultAddress);
router.get("/get-receiver/:receiverId", ReciverInfoController.getReceiverById);


module.exports = router