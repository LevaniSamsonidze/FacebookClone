const mongoose = require("mongoose");

const friendShipSchema = mongoose.Schema({
    user1: {
        type: String,
        required: true
    },
    user1Name: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    },
    user2Name: {
        type: String,
        required: true
    }
})

const FriendShip = mongoose.model("FriendShip", friendShipSchema);


module.exports = FriendShip;