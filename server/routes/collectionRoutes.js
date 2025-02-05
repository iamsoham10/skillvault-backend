const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const tokenValidator = require('../middlewares/tokenValidator');

router.use(tokenValidator);
router.post('/new-collection', collectionController.createCollectionController);

module.exports = router;