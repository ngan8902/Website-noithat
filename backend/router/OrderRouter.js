const express = require('express');
const router = express.Router();
const orderController = require('../controller/OrderController') 
const {authenticateUser} = require('../middleware/authMiddleware')


router.post('/create-order', orderController.createOrder)
router.get('/get-order-by-user', authenticateUser, orderController.getOrdersByUser)

module.exports = router;