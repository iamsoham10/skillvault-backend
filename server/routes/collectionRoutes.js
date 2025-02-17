const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const tokenValidator = require('../middlewares/tokenValidator');
const collectionInputValidator = require('../middlewares/collectionValidator');
const { searchLimiter } = require('../middlewares/rateLimiter');

router.use(tokenValidator);
router.post('/new-collection', collectionInputValidator.createCollectionInputSchema, collectionController.createCollectionController);
router.get('/all-collection', collectionInputValidator.validateGetCollections, collectionController.getCollectionsController);
router.delete('/remove-collection', collectionController.deleteCollectionController);
router.post('/share-collection', collectionInputValidator.shareCollectionInputSchema, collectionController.shareCollectionController);
router.post('/search-collection', searchLimiter, collectionInputValidator.validateSearchCollection, collectionController.searchCollectionController);

module.exports = router;