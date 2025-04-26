const express = require('express');
const router = express.Router();
const orderController = require('../controller/OrderController') 
const {authenticateUser, authenticateStaff} = require('../middleware/authMiddleware')

router.post('/create-order', orderController.createOrder)
router.get('/get-order-by-user', authenticateUser, orderController.getOrdersByUser)
router.get("/get-order/:id", orderController.getOrderByCode)
router.get("/guest/:code", orderController.getOrderByGuestCode)
router.put("/update-order-status/:orderId", orderController.updateOrderStatus)
router.get("/get-all-orders", orderController.getAllOrders)
router.delete("/delete-orders/:orderId", orderController.deleteOrderId)
router.put("/update-order-rating", orderController.updateOrderRating);

module.exports = router;