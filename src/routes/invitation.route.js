const express = require('express');
const router = express.Router();
const permissions = require('../utils/permissions');
const invitation = require('../controllers/invitation.controller');

router.post('/create', permissions.isLoggedIn, invitation.create);
router.get('/all', permissions.isLoggedIn, invitation.all);
router.get('/one/:id', permissions.isLoggedIn, invitation.one);
router.put('/update', permissions.isLoggedIn, invitation.update);
router.delete('/delete/:id', permissions.isLoggedIn, invitation.delete);

router.get('/decode', invitation.decode)
router.put('/reject', invitation.reject)
router.get('/agency/:id', permissions.isLoggedIn, invitation.agency)

module.exports = router;