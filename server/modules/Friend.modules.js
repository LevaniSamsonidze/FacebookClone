const mongoose = require("mongoose");


const FriendSchema = new mongoose.Schema({
    from: {type: String, required: true},
    to: {type: String, required: true},
})


const friendRequests = mongoose.model("friendRequests", FriendSchema);

module.exports = friendRequests;