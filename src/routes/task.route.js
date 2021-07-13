const express = require('express');
const router = express.Router();
const permissions = require('../utils/permissions');
const task = require('../controllers/task.controller');

router.post('/create', permissions.isLoggedIn, task.create);
router.get('/all', permissions.isLoggedIn, task.all);
router.get('/one/:id', permissions.isLoggedIn, task.one);
router.put('/update', permissions.isLoggedIn, task.update);
router.delete('/delete/:id', permissions.isLoggedIn, task.delete);

router.get('/client/:id', permissions.isLoggedIn, task.client)
router.get('/todo', permissions.isLoggedIn, task.todo)
router.get('/user', permissions.isLoggedIn, task.user)
router.get('/state/:state', permissions.isLoggedIn, task.state)

module.exports = router;