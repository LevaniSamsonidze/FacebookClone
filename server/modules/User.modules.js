const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    gmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        default: "user"
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: "https://tse4.mm.bing.net/th/id/OIP.YOCYcAmmqZOMDcP9mc2M6wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    friends: [],
    id:{
        type: String,
        required: true
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;