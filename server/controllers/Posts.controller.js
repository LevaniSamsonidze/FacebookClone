const Comment = require("../modules/Comment.modules");
const Post = require("../modules/Post.modules");
const User = require("../modules/User.modules");
const { AppError } = require("../utils/AppErrorHandler");
const catchAsync = require("../utils/catchAsync");

const getPosts = catchAsync(async (req, res) => {
    const posts = await Post.find();
    const users = await User.find();
    const comments = await Comment.find();

    const result = posts.map(post => {
        const user = users.find(
            u => String(u.id) === String(post.userId)
        );

        const postComments = comments.filter(
            c => String(c.postId) === String(post.postId)
        );

        return {
            ...post._doc,
            user: user || null,
            comments: postComments
        };
    });

    res.status(200).json({
        ok: true,
        posts: result,
        user: req.user
    });
});

const likePost = catchAsync(async(req, res, next) =>{
    const { id } = req.params;
    const post = await Post.findOne({postId: id});
    const likeUser = req.user.id;
    let found = false;
    if(!post){
        return next(new AppError("post not found", 404))
    }
    post.like.forEach((value, index) =>{
        if(value.toString() === likeUser){
            post.like.splice(index, 1)
            found = true;
        }
    })

    if(found){
        await post.save()
        return res.json({
            found: true,
            message: 'post unliked'
        });
    }

    post.like.push(likeUser);
    
    await post.save();

    res.json({
        ok: true,
        found: false
    })
})


module.exports = { getPosts, likePost };