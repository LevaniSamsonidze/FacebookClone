const express = require("express");
const { createComment } = require("../controllers/Comment.controller");
const verifyToken = require("../middleware/jwt.middleware");

const commentRoute = express.Router();

commentRoute.post('/createcomment/:id', verifyToken, createComment)




module.exports = commentRoute