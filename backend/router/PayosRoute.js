const express = require('express');
const router = express.Router();
const payosController = require('../controller/PayosController');

// API tạo link thanh toán
router.post('/create-payment-link', payosController.initiatePayment);

// API nhận webhook từ PayOS
router.post('/receive-hook', payosController.receiveWebhook);

module.exports = router;
