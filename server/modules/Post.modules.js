const mongoose = require("mongoose");
const User = require("./User.modules");

const PostSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    img: {type: String},
    like: [],
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    postId: {type: String, required: true}
    
});

const Post = mongoose.model("Post", PostSchema)

module.exports = Post;