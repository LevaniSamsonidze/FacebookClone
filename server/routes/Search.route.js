const express = require("express");
const { verify } = require("jsonwebtoken");
const { getUsers, profileUser } = require("../controllers/Search.controller");


const shearchRoute = express.Router();

shearchRoute.get("/sherch", verify, getUsers);
shearchRoute.get("/profileuser/:id", verify, profileUser)


module.exports = shearchRoute