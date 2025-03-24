const Collection = require("../models/Collection");
const User = require("../models/User");
const Resource = require("../models/Resource");
const client = require("../config/redisClient");

const createCollection = async ({ title, user_id, _id }) => {
  const checkCollection = await Collection.findOne({ title }).select("_id");
  if (checkCollection) {
    throw new Error("Collection already exists with same name");
  }
  const newCollection = new Collection({
    title,
    user_id,
  });
  try {
    await newCollection.save();
    await User.findByIdAndUpdate(_id, {
      $push: { collections: newCollection._id },
    });
    // Delete all collection cache keys for this user
    const keysToDelete = await client.keys(`collections:${user_id}:*`);
    if (keysToDelete.length > 0) {
      await client.del(keysToDelete);
    }
    return newCollection;
  } catch (err) {
    console.log(err);
    throw new Error("Error creating collection:", err);
  }
};

const getCollections = async ({ user_id, page, limit }) => {
  const cacheCollectionKey = `collections:${user_id}:page:${page}:limit:${limit}`;
  const cachedCollections = await client.get(cacheCollectionKey);
  if (cachedCollections) {
    return JSON.parse(cachedCollections);
  }
  const query = {
    $or: [{ user_id }, { "sharedWith.user_id": user_id }],
  };
  const collections = await Collection.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  if (!collections || collections.length === 0) {
    return [];
  }
  const totalCollections = await Collection.countDocuments(query);
  const responseCollections = {
    currentPage: page,
    totalPages: Math.ceil(totalCollections / limit),
    totalNoOfCollections: totalCollections,
    collections,
  };
  await client.set(
    cacheCollectionKey,
    JSON.stringify(responseCollections),
    "EX",
    3600
  );
  return responseCollections;
};

const deleteCollection = async ({ collection_id, user_id, _id }) => {
  const collectionToDelete = await Collection.findById(collection_id).select(
    "user_id"
  );
  if (!collectionToDelete) {
    throw new Error("Collection does not exist");
  }
  if (collectionToDelete.user_id.toString() !== user_id) {
    throw new Error("You do not have permission to delete this collection");
  }
  // delete all the resources belonging to this collection
  await Resource.deleteMany({ collection_id });
  await client.del(`collection:${collection_id}`);
  const keysToDelete = await client.keys(
    `resource:${user_id}:collection_id:${collection_id}:*`
  );
  if (keysToDelete.length > 0) {
    await client.del(keysToDelete);
  }
  // delete the collection
  const deletedCollection = await Collection.findByIdAndDelete(collection_id);
  const deleteCollectionIdFromUser = await User.findByIdAndUpdate(_id, {
    $pull: { collections: collection_id },
  });
  if (deletedCollection && deleteCollectionIdFromUser) {
    return true;
  }
};

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
};

const searchCollection = async ({ user_id, search }) => {
  const cacheCollectionSearchKey = `search:${user_id}:${search}`;
  const cachedCollectionSearch = await client.get(cacheCollectionSearchKey);
  if (cachedCollectionSearch) {
    return JSON.parse(cachedCollectionSearch);
  }
  const query = {
    $or: [{ user_id }, { "sharedWith.user_id": user_id }],
  };
  if (search) {
    query.$text = { $search: search };
  }
  try {
    const collections = await Collection.find(query)
      .select("title user_id resources")
      .lean();
    await client.set(cachedCollectionSearch, collections, "EX", 3600);
    return collections;
  } catch (err) {
    throw new Error("Error searching collections");
  }
};

module.exports = {
  createCollection,
  getCollections,
  deleteCollection,
  shareCollection,
  searchCollection,
};
