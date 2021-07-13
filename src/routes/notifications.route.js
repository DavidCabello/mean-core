const express = require('express');
const router = express.Router();
const permissions = require('../utils/permissions');
const notifications = require('../controllers/notifications.controller');

router.post('/create', permissions.isLoggedIn, notifications.create);
router.get('/all', permissions.isLoggedIn, notifications.all);
router.get('/one/:id', permissions.isLoggedIn, notifications.one);
router.put('/update', permissions.isLoggedIn, notifications.update);
router.delete('/delete/:id', permissions.isLoggedIn, notifications.delete);

module.exports = router;