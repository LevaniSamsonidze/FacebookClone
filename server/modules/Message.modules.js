const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    eceiverId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }

})

const Messages = mongoose.model("messages", messageSchema);

module.exports = Messages;