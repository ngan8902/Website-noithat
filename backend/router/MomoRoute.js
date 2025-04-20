const express = require("express");
const router = express.Router();
const { initiateMomoPayment, verifyPaymentStatus, momoWebhook } = require("../controller/MomoController");

router.post("/pay", initiateMomoPayment);
router.post("/payment-status/:orderId", verifyPaymentStatus);
router.post('/webhook', momoWebhook);

module.exports = router;
