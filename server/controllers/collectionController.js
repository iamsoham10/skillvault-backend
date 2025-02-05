const asyncHandler = require('express-async-handler');
const collectionService = require('../services/collectionService');

const createCollectionController = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const user_id = req.user.user_id;
    const newCollection = await collectionService.createCollection({ title, user_id });
    res.status(201).json({ success: true, message: "Collection created successfully", collection: newCollection });
});

module.exports = { createCollectionController };