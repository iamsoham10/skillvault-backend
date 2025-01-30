const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.post('/new-resource', resourceController.createResourceController);

module.exports = router;