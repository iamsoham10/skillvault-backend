const asyncHandler = require('express-async-handler');
const collectionService = require('../services/collectionService');

const createCollectionController = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const user_id = req.user.user_id;
    const newCollection = await collectionService.createCollection({ title, user_id });
    res.status(201).json({ success: true, message: "Collection created successfully", collection: newCollection });
});

const getCollectionsController = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const { page, limit } = req.query;
    const collections = await collectionService.getCollections({ user_id, page, limit });
    res.status(200).json({ success: true, message: "Collections fetched successfully", AllCollections: collections });
});

module.exports = { createCollectionController, getCollectionsController };