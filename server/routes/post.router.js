const express = require("express");
const verifyToken = require("../middleware/jwt.middleware");
const { createPost, getPost, deletePost, editPost } = require("../controllers/Post.controller");
const { uploadPost } = require("../middleware/Multer.middleware");
const { getPosts, likePost } = require("../controllers/Posts.controller");

const postRouter = express.Router()

postRouter.post("/createpost", verifyToken, uploadPost.single("postImg"), createPost);
postRouter.get("/post", verifyToken, getPost);
postRouter.delete("/delete/:id", deletePost)
postRouter.patch("/edit/:id", editPost);
postRouter.get('/posts', verifyToken, getPosts);
postRouter.post('/likepost/:id', verifyToken, likePost);

module.exports = postRouter;