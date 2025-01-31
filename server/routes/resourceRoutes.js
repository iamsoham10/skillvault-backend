const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.post('/new-resource', resourceController.createResourceController);
router.get('/all-resources/:user_id', resourceController.getAllResourcesController);
router.put('/update-resource', resourceController.updateResourceController);
router.delete('/delete-resource/:_id', resourceController.deleteResourceController);

module.exports = router;