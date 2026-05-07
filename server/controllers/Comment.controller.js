const Comment = require("../modules/Comment.modules");
const Post = require("../modules/Post.modules");
const { AppError } = require("../utils/AppErrorHandler");
const catchAsync = require("../utils/catchAsync");


const createComment = catchAsync(async(req, res) =>{
    const { id } = req.params;
    const { comment } = req.body;
    const post = await Post.findOne({postId: id});
    if(!post){
        return next(new AppError("not found post", 404))
    }
    const newComment = Comment({
        postId: post.postId,
        comment: comment,
        user: {
            fullName: req.user.fullName,
            userId: req.user.id
        }
    })

    await newComment.save();
    
    res.json({
        ok: true,
        newComment
    })
})


module.exports = { createComment }