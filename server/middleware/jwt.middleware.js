const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: "Unauthorized"
        });
    }
    
    const decoded = jwt.verify(token, process.env.TOKEN);

    req.user = decoded;
    next();
}

module.exports = verifyToken;