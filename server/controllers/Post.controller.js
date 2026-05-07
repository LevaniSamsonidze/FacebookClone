const Post = require("../modules/Post.modules");
const { AppError } = require("../utils/AppErrorHandler");
const catchAsync = require("../utils/catchAsync");

const createPost = (async (req, res) => {
    const { title, description, id, name } = req.body;
    const post = new Post({
        title,
        description,
        postId: id,
        img: req.file ? `/imgs/postImg/${req.file.filename}` : null,
        userId: req.user?.id, 
        userName: name
    });

    await post.save();

    res.json({
        ok: true,
        post
    });
});

const getPost = async(req, res) =>{
    const post = await Post.find({userId: req.user.id});

    res.status(200).json({ok: true, post})
}

const deletePost = catchAsync(async(req, res, next) =>{
    const { id } = req.params;
    
    const post = await Post.findOneAndDelete({ postId: id });

    if(!post){
        return next( new AppError("Id inccorect", 400))
    }

    res.json({
        ok: true,
        message: "Post Delete",
        post: post
    })
})



const editPost = catchAsync(async(req, res, next) =>{
    const { id } = req.params;
    const { title, description} = req.body;

    const post = await Post.findOne({postId: id});

    if(!post){
        return next( new AppError("post not found", 404))
    }

    if(!title && !description){
        return next( new AppError('No values provided', 404))
    }

    if (title) post.title = title;
    if (description) post.description = description;

    await post.save()

    res.json({
        ok: true,
        message: "The post has been changed",
        post
    });
    
})

module.exports = { createPost, getPost, deletePost, editPost };