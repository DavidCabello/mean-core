const express = require('express');
const router = express.Router();
const permissions = require('../utils/permissions');
const roles = require('../controllers/roles.controller');

router.post('/create', permissions.isLoggedIn, roles.create);
router.get('/all', permissions.isLoggedIn, roles.all);
router.get('/one/:id', permissions.isLoggedIn, roles.one);
router.put('/update', permissions.isLoggedIn, roles.update);
router.delete('/delete/:id', permissions.isLoggedIn, roles.delete);

router.get('/user', permissions.isLoggedIn, roles.user)

module.exports = router;