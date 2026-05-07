const express = require("express");
const verifyToken = require("../middleware/jwt.middleware");
const { getFriends, getMessage } = require("../controllers/Messages.controller");

const messageRouter = express.Router();

messageRouter.get("/messageuser", verifyToken, getFriends)
messageRouter.get("/message/:id", verifyToken, getMessage)

module.exports = messageRouter;