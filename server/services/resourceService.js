const Resource = require('../models/Resource');

const createResource = async ({ title, url, description, user_id, tags }) => {
    const resourceExist = await Resource.findOne({ url: url }).select('user_id');
    if (resourceExist) {
        throw new Error('Resouce already exists');
    }
    const newResource = new Resource({
        user_id,
        title,
        url,
        description,
        tags,
    });
    try {
        await newResource.save();
        return newResource;
    } catch (err) {
        throw new Error("Error saving resource: ", err);
    }
}

const getResources = async ({ user_id }) => {
    const resourceExist = await Resource.find({ user_id });
    if (resourceExist.length === 0) {
        return [];
    }
    return resourceExist;
}

const updateResource = async ({ _id, updates }) => {
    const resourceExist = await Resource.findByIdAndUpdate(_id, { $set: updates }, { new: true });
    if (!resourceExist) {
        throw new Error("Resource does not exist");
    }
    return resourceExist;
}

const deleteResource = async ({ _id }) => {
    const resourceToDelete = await Resource.findByIdAndDelete(_id);
    if (!resourceToDelete) {
        throw new Error("Resource does not exist");
    }
    return resourceToDelete;
}

module.exports = { createResource, getResources, updateResource, deleteResource };