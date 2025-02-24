const express = require('express');
const router = express.Router();
const productController = require('../controller/ProductController') 
const {authenticateStaff, authenticateUser} = require('../middleware/authMiddleware')


router.post('/create-product' , productController.createProduct)
router.put('/update-product/:id' , authenticateStaff,productController.updateProduct)
router.get('/details-product/:id' , productController.getDetailsProduct)
router.delete('/delete-product/:id' , productController.deleteProduct)
router.get('/all-product' , productController.getAllProduct)
router.get('/get-all-type' , productController.getAllType)






module.exports = router