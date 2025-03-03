const express = require('express');
const router = express.Router();
const orderController = require('../controller/OrderController') 
const {authUserMiddleware, authenticateUser} = require('../middleware/authMiddleware')


router.post('/create-order' ,authenticateUser, orderController.createOrder)

module.exports = router;