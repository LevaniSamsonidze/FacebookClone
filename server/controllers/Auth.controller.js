const User = require("../modules/User.modules");
const { AppError } = require("../utils/AppErrorHandler");
const catchAsync = require("../utils/catchAsync");
const nodemailer = require("nodemailer");
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


const verifyGmail = async(req, res, next) => {
    try {
        const { gmail } = req.body;
        console.log("verifyGmail called", gmail);
        const code = Math.floor(100000 + Math.random() * 900000);

        const user = await User.findOne({ gmail });
        if (user) {
            return res.status(400).json({ ok: false, message: "Already registered" });
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: process.env.GMAIL,
            to: gmail,
            subject: "Verification Code",
            text: `Your verification code is ${code}`
        });

        console.log("mail sent!");
        res.status(200).json({ ok: true, code });

    } catch(err) {
        console.error("ERROR:", err.message);
        res.status(500).json({ ok: false, message: err.message });
    }
};

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