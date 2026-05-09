const User = require("../modules/User.modules");
const { AppError } = require("../utils/AppErrorHandler");
const catchAsync = require("../utils/catchAsync");
const { Resend } = require('resend');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const SignUp = async (req, res) =>{
    const { name, lastname, gmail, password, id } = req.body;
    const passwordHeshed = await bcrypt.hash(password, 10);
    const user = new User({
        name: name,
        lastname: lastname,
        gmail: gmail,
        password: passwordHeshed,
        id: id
    })

    await user.save();
    res.status(201).json({
        ok: true,
        message: "User created successfully"
    })
}


const verifyGmail = catchAsync(async(req, res, next) => {
    const { gmail } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000);

    const user = await User.findOne({ gmail });
    if (user) {
        return next(new AppError(`This ${gmail} user is already registered.`, 400));
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
        from: process.env.GMAIL,
        to: gmail,
        subject: 'Verification Code',
        text: `Your verification code is ${code}`
    });

    res.status(200).json({
        ok: true,
        code
    });
});

const Login = catchAsync(async(req, res, next) =>{
    const { gmail, password } = req.body;

    const user = await User.findOne({ gmail });

    if(!user){
        return next(new AppError("Invalid gmail or password", 400));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect){
        return next(new AppError("Invalid gmail or password", 400));
    }

    const token = jwt.sign({id: user.id, role: user.role, profilePhoto: user.photo, fullName: user.name + ' ' + user.lastname}, process.env.TOKEN, { expiresIn: "3d" });

    res.status(200).json({
        ok: true,
        token
    })


})

const GetUser = async(req, res, next) => {
    if(!req.user) {
        return next(new AppError("User not found", 404));
    }
    
    const id = req.user.id;

    const user = await User.findOne({ id }).select("-password -_id -__v");

    res.status(200).json({
        ok: true,
        user
    })
    
}

module.exports = {
    SignUp,
    verifyGmail,
    Login,
    GetUser
}