const express = require("express");
const axios = require("axios");
const Resource = require('../models/Resource');
const Collection = require('../models/Collection');
const router = express.Router();

router.get('/demo-flask', async (req, res) => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/hello');
        res.status(200).json({ success: true, message: "Flask API called", data: response.data });
    } catch (err) {
        throw new Error('Could not call Flask API');
    }
});

router.post('/send-resources', async (req, res) => {
    const { collection_id } = req.body;
    try {
        const [fetchCollection, allDbResources] = await Promise.all([
            await Collection.findById(collection_id).select("resources"),
            await Resource.find().select("_id title description tags")
        ])
        if (!collection_id) {
            return res.status(400).json({ success: false, message: "collection_id is required" });
        }
        if (!fetchCollection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }
        const collectionResources = await Resource.find({ _id: { $in: fetchCollection.resources } }).select("_id title description tags")
        const response = await axios.post('http://127.0.0.1:5000/accept-resources', {
            userResources: collectionResources,
            DBResources: allDbResources
        });
        res.status(200).json({ success: true, message: "resources sent", data: response.data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
)

module.exports = router;