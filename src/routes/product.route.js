const express = require('express');
const router = express.Router();
const product = require('../controllers/product.controller');

router.post('/create', product.createProduct);
router.get('/get', product.getUserProducts);
router.get('/all', product.getAllProducts);
router.get('/one/:id', product.getProductByID);
router.put('/update/:id', product.updateProduct);
router.delete('/delete/:id', product.deleteProduct);

module.exports = router;