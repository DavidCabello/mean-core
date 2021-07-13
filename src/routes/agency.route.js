const express = require('express');
const router = express.Router();
const permissions = require('../utils/permissions');
const agency = require('../controllers/agency.controller');

router.post('/create', permissions.isLoggedIn, agency.create);
router.get('/all', permissions.isLoggedIn, agency.all);
router.get('/one/:id', agency.one);
router.get('/user', permissions.isLoggedIn, agency.user);
router.put('/update', permissions.isLoggedIn, agency.update);
router.delete('/delete/:id', permissions.isLoggedIn, agency.delete);

module.exports = router;