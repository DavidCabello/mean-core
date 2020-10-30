const express = require('express');
const router = express.Router();
const mailer = require('../controllers/mailer.controller');

router.post('/send', mailer.send);
router.post('/forgetPassword', mailer.forgotenPassword);

module.exports = router;