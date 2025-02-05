const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const tokenValidator = require('../middlewares/tokenValidator');

router.use(tokenValidator);
router.post('/new-resource', resourceController.createResourceController);
router.get('/all-resources', resourceController.getAllResourcesController);
router.put('/update-resource', resourceController.updateResourceController);
router.delete('/delete-resource', resourceController.deleteResourceController);
router.get('/search', resourceController.searchResourcesController);

module.exports = router;