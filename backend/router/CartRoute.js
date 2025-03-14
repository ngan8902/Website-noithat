const express = require('express');
const router = express.Router();
const CartController = require('../controller/CartController');
const {authenticateStaff, authenticateUser} = require('../middleware/authMiddleware')


router.post('/add-cart' ,authenticateUser, CartController.addToCart)
router.get("/get-cart",authenticateUser, CartController.getCart);
router.delete("/remove-item/:productId", authenticateUser, CartController.removeItem);
router.put("/update-cart", authenticateUser, CartController.updateCart);



module.exports = router;
