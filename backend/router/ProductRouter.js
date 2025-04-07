const express = require('express');
const router = express.Router();
const productController = require('../controller/ProductController')
const { authenticateStaff, authenticateUser } = require('../middleware/authMiddleware')
const { upload } = require('../service/ImagesService')

router.post('/create-product', upload.single("image"), productController.createProduct)
router.put('/update-product/:id',upload.single("image"), productController.updateProduct)
router.get('/details-product/:id', productController.getDetailsProduct)
router.delete('/delete-product/:id', productController.deleteProduct)
router.get('/all-product', productController.getAllProduct)
router.get('/get-product-by-type', productController.getProductByType)
router.get('/get-all-type', productController.getAllType)
router.get('/search-product', productController.searchProduct)
router.get('/suggestions', productController.getSuggestions);
router.get('/:productId/rating', productController.getRating);

module.exports = router