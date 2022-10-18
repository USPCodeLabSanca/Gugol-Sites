const siteControllers = require('../controllers/site');
const userControllers = require('../controllers/user');
const express = require('express');
const router = express.Router();

router.post('/site/:id/create', userControllers.validateToken, siteControllers.createSite);
router.put('/site/:userID/:id/edit', userControllers.validateToken, siteControllers.editSiteName);
router.delete('/site/:userID/:id/delete', userControllers.validateToken, siteControllers.deleteSite);

module.exports = router;