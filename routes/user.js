const userControllers = require('../controllers/user')
const express = require('express');
const router = express.Router();

router.post('/user', userControllers.createUser);
router.post('/user/auth', userControllers.authUser);

module.exports = router;