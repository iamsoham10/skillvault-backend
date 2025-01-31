const asyncHandler = require('express-async-handler');
const resourceService = require('../services/resourceService');

const createResourceController = asyncHandler(async (req, res) => {
    const { title, url, description, user_id, tags } = req.body;
    const newResource = await resourceService.createResource({ title, url, description, user_id, tags });
    res.status(201).json({ success: true, message: "Resource saved successfully", resource: newResource });
});

const getAllResourcesController = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const allResources = await resourceService.getResources({ user_id });
    res.status(200).json({ success: true, message: "Resources fetched successfully", resources: allResources });
});

const updateResourceController = asyncHandler(async (req, res) => {
    const { _id, title, url, description, tags } = req.body;
    const updates = { title, url, description, tags };
    const updatedResource = await resourceService.updateResource({ _id, updates });
    res.status(200).json({ success: true, message: "Resource updated successfully", resource: updatedResource });
});

const deleteResourceController = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const deletedResource = await resourceService.deleteResource({ _id });
    res.status(204).json({ success: true, message: "Resource deleted successfully", resource: deletedResource });
});

module.exports = { createResourceController, getAllResourcesController, updateResourceController, deleteResourceController };