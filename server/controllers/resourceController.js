const asyncHandler = require('express-async-handler');
const resourceService = require('../services/resourceService');

const createResourceController = asyncHandler(async (req, res) => {
    const { title, url, description, tags } = req.body;
    const user_id = req.user.user_id;
    const newResource = await resourceService.createResource({ title, url, description, user_id, tags });
    res.status(201).json({ success: true, message: "Resource saved successfully", resource: newResource });
});

const getAllResourcesController = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const { page, limit } = req.query;
    const allResources = await resourceService.getResources({ user_id, page, limit });
    res.status(200).json({ success: true, message: "Resources fetched successfully", resources: allResources });
});

const updateResourceController = asyncHandler(async (req, res) => {
    const { title, url, description, tags } = req.body;
    const { _id } = req.query
    const updates = { title, url, description, tags };
    const updatedResource = await resourceService.updateResource({ _id, updates });
    res.status(200).json({ success: true, message: "Resource updated successfully", resource: updatedResource });
});

const deleteResourceController = asyncHandler(async (req, res) => {
    const { _id } = req.query;
    await resourceService.deleteResource({ _id });
    res.status(200).json({ success: true, message: "Resource deleted successfully" });
});

const searchResourcesController = asyncHandler(async (req, res) => {
    const { user_id } = req.user; // Get user from auth middleware
    const { topic, search } = req.query;

    const results = await resourceService.searchResources({ user_id, topic, search });

    res.status(200).json({ success: true, message: "Search results", resources: results });
});


module.exports = { createResourceController, getAllResourcesController, updateResourceController, deleteResourceController, searchResourcesController };