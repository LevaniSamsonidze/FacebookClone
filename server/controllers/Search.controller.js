const FriendShip = require("../modules/FriendShip.modules");
const Post = require("../modules/Post.modules");
const User = require("../modules/User.modules");
const { AppError } = require("../utils/AppErrorHandler");
const catchAsync = require("../utils/catchAsync");

const getUsers = catchAsync(async (req, res, next) =>{
    const { username } = req.query;

    const parts = username.split(" ");

    const users = await User.find({
        $or: [
            { name: { $regex: parts[0], $options: "i" } },
            { lastname: { $regex: parts[0], $options: "i" } },
            ...(parts[1]
            ? [
                { name: { $regex: parts[1], $options: "i" } },
                { lastname: { $regex: parts[1], $options: "i" } }
                ]
            : [])
        ]
    });
    
    if(!users){
        return next(new AppError("user not found", 404))
    }

    res.json({
        ok: true,
        users
    })
})

const profileUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({id});
    const posts = await Post.find({userId: id});
    
    if(!user){
        return next(new AppError("user not found", 404))
    }

    res.json({
        ok: true,
        user: user,
        post: posts
    })
    
})

module.exports = { getUsers, profileUser }