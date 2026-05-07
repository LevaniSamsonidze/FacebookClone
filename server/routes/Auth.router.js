const express = require('express');
const User = require('../modules/User.modules');
const { verifyGmail, SignUp, Login, GetUser } = require('../controllers/Auth.controller');
const verifyToken = require('../middleware/jwt.middleware');
const fs = require("fs");
const catchAsync = require('../utils/catchAsync');
const { uploadProfile } = require('../middleware/Multer.middleware');


const authRouter = express.Router();

authRouter.post("/signup/verifyGmail", verifyGmail);
authRouter.post("/signup", SignUp);
authRouter.post("/login", Login)
authRouter.get("/getuser", verifyToken, GetUser)

// აქ დამეზარა ახალი როუთეს შექმნა და სახელის მოფიქრება ამიტომ ავტორიზააცისს როუთეს ქვეშ დავწერ რა ;დდდდ

authRouter.patch("/upload", uploadProfile.single("profileImg"), catchAsync(async(req, res) => {
    const { id } = req.body;

    const user = await User.findOne({id})
    
    user.photo = `http://localhost:3000/imgs/profileImg/${req.file.filename}`;

    await user.save()

   
}))

module.exports = authRouter;