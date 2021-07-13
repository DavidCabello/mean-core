const express = require('express');
const router = express.Router();
const mailer = require('../controllers/mailer.controller');
const permissions = require('../utils/permissions');

router.post('/send', mailer.send);
router.post('/forgetPassword', mailer.forgotenPassword);
router.post('/verify', mailer.verify)
router.post('/invite', permissions.isLoggedIn, mailer.invite)

module.exports = router;