const siteControllers = require('../controllers/site');
const express = require('express');
const router = express.Router();

router.post('/site', siteControllers.createSite);
router.put('/site/:id/edit', siteControllers.editSiteName);
router.delete('/site/:id/delete', siteControllers.deleteSite);

module.exports = router;