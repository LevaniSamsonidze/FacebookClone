const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    postId: {type: String, required: true},
    comment: {type: String, required: true},
    user: {
        fullName: String,
        userId: String
    }
})

const Comment = mongoose.model("PostComment", commentSchema);

module.exports = Comment