const express = require('express');
const router = express.Router();
const CartController = require('../controller/CartController');
const {authenticateStaff, authenticateUser} = require('../middleware/authMiddleware')

router.post('/add-cart' ,authenticateUser, CartController.addToCart)
router.get("/get-cart",authenticateUser, CartController.getCart);
router.delete("/remove-item/:itemId", authenticateUser, CartController.removeItem);
router.put("/update-cart/:productId", authenticateUser, CartController.updateCart);
router.post("/clear-purchased", authenticateUser, CartController.clearPurchasedItems);

module.exports = router;
