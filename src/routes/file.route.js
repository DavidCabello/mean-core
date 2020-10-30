const express = require('express');
const router = express.Router();
const file = require('../controllers/file.controller');

router.post('/upload', file.uploadFile);

module.exports = router;