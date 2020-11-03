const express = require('express');
const router = express.Router();
const permissions = require('../utils/permissions');
const product = require('../controllers/product.controller');

router.post('/create', permissions.isLoggedIn, product.createProduct);
router.get('/get', permissions.isLoggedIn, product.getUserProducts);
router.get('/all', permissions.isLoggedIn, product.getAllProducts);
router.get('/one/:id', permissions.isLoggedIn, product.getProductByID);
router.put('/update/:id', permissions.isLoggedIn, product.updateProduct);
router.delete('/delete/:id', permissions.isLoggedIn, product.deleteProduct);

module.exports = router;