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

module.exports = { createCollection };