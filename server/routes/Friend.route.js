const express = require('express');
const verifyToken = require('../middleware/jwt.middleware');
const { getUsers, sentRequest, confrimRequests, deleteFriend } = require('../controllers/Friend.controller');

const friendRouter = express.Router();

friendRouter.get("/users", verifyToken, getUsers)
friendRouter.post("/sentrequest/:to", verifyToken, sentRequest);
friendRouter.post('/confrim/:id', verifyToken, confrimRequests)
friendRouter.delete('/friendremove/:id', verifyToken, deleteFriend)

module.exports = friendRouter;