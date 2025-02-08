const Collection = require('../models/Collection');

const createCollection = async ({ title, user_id }) => {
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
        return newCollection;
    } catch (err) {
        console.log(err);
        throw new Error("Error creating collection:", err);
    }
}

const getCollections = async ({ user_id, page, limit }) => {
    const collections = await Collection.find({ user_id })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean() // for converting into plain javascript objects
    if (!collections) {
        throw new Error("No collections present for this user");
    }
    const totalCollections = await Collection.countDocuments({ user_id });
    return {
        currentPage: page,
        totalPages: Math.ceil(totalCollections / limit),
        totalNoOfCollections: totalCollections,
        collections,
    }
}

module.exports = { createCollection, getCollections };