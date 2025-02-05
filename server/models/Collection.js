const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        ref: "User",
        required: true,
    },
    resources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource"
    }]
});

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;