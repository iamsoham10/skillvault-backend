const Resource = require('../models/Resource');
const Collection = require('../models/Collection');
const metadataService = require('../services/metadataService');
const mongoose = require('mongoose');
const client = require('../config/redisClient');
const DEFAULT_THUMBNAIL = "https://getuikit.com/v2/docs/images/placeholder_600x400.svg";

const createResource = async ({ title, url, description, user_id, tags, collection_id, domain, favicon, thumbnail }) => {

    const [resourceExist, metadata, findCollection] = await Promise.all([
        await Resource.findOne({ url, user_id }).select('_id').lean(),
        await metadataService.metadataExtraction(url),
        await Collection.findById(collection_id).select("user_id sharedWith").lean(),
    ]);
    if (resourceExist) {
        throw new Error('This resource already exists for this user');
    }
    const newResource = new Resource({
        user_id,
        title,
        url,
        description,
        tags,
        collection_id,
        domain: metadata.domainName,
        favicon: metadata.faviconImage,
        thumbnail: metadata.thumbnail || DEFAULT_THUMBNAIL,
    });
    const checkPermission = async (collection_id, user_id) => {
        // check if user is owner
        if (findCollection.user_id === user_id) {
            return true;
        }
        const sharedResourceAccess = findCollection.sharedWith.find(shared => shared.user_id === user_id);
        return sharedResourceAccess?.role === 'editor';
    }
    const userHasPermission = await checkPermission(collection_id, user_id);
    if (!userHasPermission) {
        throw new Error("You do not have permission to edit this collection");
    }
    try {
        await Promise.all([
            await newResource.save(),
            await Collection.findByIdAndUpdate(collection_id, {
                $push: { resources: newResource._id }
            }),
        ]);
        const currentUser_ID = findCollection.user_id;
        const [keysToDeleteSearch, keysToDeleteResource, keysToDeleteCollectionEditor, keysToDeleteCollectionOwner] = await Promise.all([
            client.keys(`search:${user_id}:collection_id:${collection_id}:*`),
            client.keys(`resource:${user_id}:collection_id:${collection_id}:*`),
            client.keys(`collections:${user_id}:*`),
            client.keys(`collections:${currentUser_ID}:*`),
        ]);
        const deletePromises = [];
        if (keysToDeleteSearch.length > 0) {
            deletePromises.push(client.del(keysToDeleteSearch));
        };
        if(keysToDeleteResource.length > 0){
            deletePromises.push(client.del(keysToDeleteResource));
        };
        if(keysToDeleteCollectionEditor.length > 0) {
            deletePromises.push(client.del(keysToDeleteCollectionEditor));
        };
        if(keysToDeleteCollectionOwner.length > 0){
            deletePromises.push(client.del(keysToDeleteCollectionOwner));
        }
        if(deletePromises.length > 0){
            await Promise.all(deletePromises);
        }
        return newResource;
    } catch (err) {
        throw new Error("Error saving resource: ", err);
    }
}

const getResources = async ({ user_id, collection_id, page, limit }) => {
    // check the redis cache
    const cacheKey = `resource:${user_id}:collection_id:${collection_id}:page:${page}:limit:${limit}`;
    const cachedResources = await client.get(cacheKey);
    if (cachedResources) {
        return JSON.parse(cachedResources);
    }
    try {
        const resources = await Resource.find({ collection_id })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        if (!resources || resources.length === 0) {
            return [];
        }
        const total = await Resource.countDocuments({ user_id });
        const response = {
            currentPage: page,
            resources,
            totalPages: Math.ceil(total / limit),
            totalResources: total
        };
        await client.set(cacheKey, JSON.stringify(response), "EX", 3600);
        return response;
    } catch (err) {
        throw new Error("Error fetching resources: ", err);
    }
}

const updateResource = async ({ _id, updates, user_id }) => {
    if (Object.keys(updates).length === 0) {
        throw new Error("No updates provided");
    }
    const resource = await Resource.findById(_id).select("collection_id");
    if (!resource) {
        throw new Error("Resource does not exist");
    }

    const fetchedCollection = await Collection.findOne({ resources: _id }).select("user_id sharedWith");
    if (!fetchedCollection) {
        throw new Error("Resource does not belong to any collection");
    }
    const checkUserPermission = async (fetchedCollection, user_id) => {
        if (fetchedCollection.user_id === user_id) {
            return true;
        }
        const sharedAcess = fetchedCollection.sharedWith.find(share => share.user_id === user_id);
        return sharedAcess?.role === 'editor';
    }
    const hasPermission = await checkUserPermission(fetchedCollection, user_id);
    if (!hasPermission) {
        throw new Error("You do not have permission to edit this resource");
    }
    const updateResource = await Resource.findByIdAndUpdate(_id, { $set: updates }, { new: true });
    if (!updateResource) {
        throw new Error("Resource does not exist");
    }
    const keysToUpdate = await client.keys(`resource:${user_id}:collection_id:${resource.collection_id}:*`);
    if (keysToUpdate.length > 0) {
        await client.del(keysToUpdate);
    };
    return updateResource;
}

const deleteResource = async ({ _id, user_id }) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid resource id");
    }
    // get the collection id
    const resource = await Resource.findById(_id).select("collection_id");
    if (!resource) {
        throw new Error("Resource does not exist");
    }
    // get the collection in which the resource exists
    const collection = await Collection.findOne({ _id: resource.collection_id }).select("user_id");
    if (!collection) {
        throw new Error("Resource does not belong to any collection");
    }
    const isOwner = collection.user_id.toString() === user_id;
    if (!isOwner) {
        throw new Error("You do not have permission to delete this resource");
    }
   try{
    const resourceToDelete = await Resource.findByIdAndDelete(_id);
    if (!resourceToDelete) {
        throw new Error("Resource does not exist");
    }
    Collection.findByIdAndUpdate(resourceToDelete.collection_id, {
        $pull: { resources: _id }
    });
    const [keysToDeleteSearch, keysToDeleteResource] = await Promise.all([
        client.keys(`search;${user_id}:collection_id:${resource.collection_id}:*`),
        client.keys(`resource:${user_id}:collection_id:${resource.collection_id}:*`)
    ]);
    const deletePromises = [];
    if(keysToDeleteSearch.length > 0){
        deletePromises.push(client.del(keysToDeleteSearch));
    }
    if(keysToDeleteResource.length > 0){
        deletePromises.push(client.del(keysToDeleteResource));
    }
    if(deletePromises.length > 0){
        await Promise.all(deletePromises);
    }
    return true;
   } catch(err){
    throw new Error("Error deleting resource");
   }
}

const searchResources = async ({ user_id, collection_id, search }) => {
    const cacheSearchKey = `search:${user_id}:collection_id:${collection_id}:${search}`;
    const cachedSearchResource = await client.get(cacheSearchKey);
    if (cachedSearchResource) {
        return JSON.parse(cachedSearchResource);
    }
    const query = { user_id, collection_id };
    if (search) {
        query.$text = { $search: search };
    }
    try {
        const findResources = await Resource.find(query)
            .sort({ createAt: -1 })
            .limit(10);
        await client.set(cacheSearchKey, JSON.stringify(findResources), "EX", 3600);
        return findResources;
    } catch (err) {
        console.log(err);
        throw new Error('Error finding resource');
    }
}

module.exports = { createResource, getResources, updateResource, deleteResource, searchResources };