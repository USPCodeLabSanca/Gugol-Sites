const userControllers = require('../controllers/user')
const express = require('express');
const router = express.Router();

router.post('/user', userControllers.createUser);
router.post('/user/auth', userControllers.authUser);
router.get('/user/:id', userControllers.validateToken, userControllers.getUser);
router.get('/user/:id/site', userControllers.validateToken, userControllers.getUsersSite);

module.exports = router;