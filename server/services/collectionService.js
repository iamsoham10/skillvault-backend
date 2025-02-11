const Collection = require('../models/Collection');
const User = require('../models/User');

const createCollection = async ({ title, user_id, _id }) => {
    const checkCollection = await Collection.findOne({ title }).select("_id");
    if (checkCollection) {
        throw new Error('Collection already exists with same name');
    }
    const newCollection = new Collection({
        title,
        user_id
    });
    try {
        await newCollection.save();
        await User.findByIdAndUpdate(_id, {
            $push: { collections: newCollection._id }
        })
        return newCollection;
    } catch (err) {
        console.log(err);
        throw new Error("Error creating collection:", err);
    }
}

const getCollections = async ({ user_id, page, limit }) => {
    const query = {
        $or: [
            { user_id },
            { 'sharedWith.user_id': user_id }
        ]
    }
    const collections = await Collection.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean() // for converting into plain javascript objects
    if (!collections || collections.length === 0) {
        throw new Error("No collections present for this user");
    }
    const totalCollections = await Collection.countDocuments(query);
    return {
        currentPage: page,
        totalPages: Math.ceil(totalCollections / limit),
        totalNoOfCollections: totalCollections,
        collections,
    }
}

const shareCollection = async ({ collection_id, user_id, role }) => {
    const collection = await Collection.findById(collection_id);
    if (!collection) {
        throw new Error("Collection does not exist");
    }
    collection.sharedWith.push({ user_id, role });
    try {
        await collection.save();
        return collection;
    } catch (err) {
        throw new Error("Error sharing collection");
    }
}

const searchCollection = async ({ user_id, search }) => {
    const query = {
        $or: [
            { user_id },
            { 'sharedWith.user_id': user_id }
        ]
    };
    if (search) {
        query.$text = { $search: search };
    }
    try {
        const collections = await Collection.find(query)
            .select('title user_id resources')
            .lean();
        return collections;
    } catch (err) {
        throw new Error('Error searching collections');
    }
}

module.exports = { createCollection, getCollections, shareCollection, searchCollection };