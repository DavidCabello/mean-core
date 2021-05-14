const express = require('express');
const router = express.Router();
const passport = require('passport');
const permissions = require('../utils/permissions');
const user = require('../controllers/user.controller');

router.post('/signup', passport.authenticate('signup', {session: false}), user.signup);
router.post('/login', passport.authenticate('login'), user.login);
router.get('/logged', permissions.isLoggedIn, user.logged);
router.get('/all', permissions.isLoggedIn, user.all);
router.get('/one/:id', permissions.isLoggedIn, user.one);
router.post('/forgot', user.updatePassword);
router.get('/logout', permissions.isLoggedIn, user.logout);
router.put('/update', permissions.isLoggedIn, user.update);
router.put('/updatePass', permissions.isLoggedIn, user.updatePasswordWithId);
router.delete('/delete/:id', permissions.isLoggedIn, user.delete);

module.exports = router;