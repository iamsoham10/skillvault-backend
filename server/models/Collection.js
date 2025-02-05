const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
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
collectionSchema.index({ title: "text" })


const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;