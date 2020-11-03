const express = require('express');
const router = express.Router();
const passport = require('passport');
const permissions = require('../utils/permissions');
const user = require('../controllers/user.controller');

router.post('/register', passport.authenticate('signup', {session: false}), user.registerUser);
router.post('/login', passport.authenticate('login'), user.loginUser);
router.get('/current', permissions.isLoggedIn, user.getCurrentUser);
router.get('/all', permissions.isLoggedIn, user.getAllUsers);
router.get('/one/:id', permissions.isLoggedIn, user.getOneUser);
router.post('/forgot', user.updatePassword);
router.get('/logout', permissions.isLoggedIn, user.logout);
router.put('/update/:id', permissions.isLoggedIn, user.updateUser);
router.put('/updatePass/:id', permissions.isLoggedIn, user.updatePasswordWithID);
router.delete('/delete/:id', permissions.isLoggedIn, user.deleteUser);

module.exports = router;