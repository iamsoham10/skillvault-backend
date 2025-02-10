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
    }],
    sharedWith: [{
        user_id: {
            type: String,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ['viewer', 'editor'],
            required: true
        }
    }]
});
collectionSchema.index({ title: "text" })


const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;