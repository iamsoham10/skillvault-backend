const asyncHandler = require('express-async-handler');
const collectionService = require('../services/collectionService');

const createCollectionController = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const _id = req.query;
    const user_id = req.user.user_id;
    const newCollection = await collectionService.createCollection({ title, user_id, _id });
    res.status(201).json({ success: true, message: "Collection created successfully", collection: newCollection });
});

const getCollectionsController = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const { page, limit } = req.query;
    const collections = await collectionService.getCollections({ user_id, page, limit });
    res.status(200).json({ success: true, message: "Collections fetched successfully", AllCollections: collections });
});

const deleteCollectionController = asyncHandler(async (req, res) => {
    const { collection_id } = req.query;
    const user_id = req.user.user_id;
    await collectionService.deleteCollection({ collection_id, user_id });
    res.status(200).json({ success: true, message: "Collection deleted successfully" });
})

const shareCollectionController = asyncHandler(async (req, res) => {
    const { collection_id, role } = req.query;
    const { user_id } = req.body;
    await collectionService.shareCollection({ collection_id, user_id, role });
    res.status(200).json({ success: true, message: "Collection shared successfully" });
});

const searchCollectionController = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const { search } = req.query;
    const collections = await collectionService.searchCollection({ user_id, search });
    res.status(200).json({ success: true, message: "Search results", collections });
})

module.exports = { createCollectionController, getCollectionsController, deleteCollectionController, shareCollectionController, searchCollectionController };