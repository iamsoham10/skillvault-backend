const asyncHandler = require('express-async-handler');
const resourceService = require('../services/resourceService');

const createResourceController = asyncHandler(async (req, res) => {
    const {title, url, description} = req.body;
    const newResource = await resourceService.createResource({title, url, description});
    res.status(201).json({success: true, message: "Resource saved successfully", resource: newResource});
});

module.exports = {createResourceController};