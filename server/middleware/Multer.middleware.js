const multer = require("multer");

const storageProfile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "imgs/profileImg");
    },
    filename: function (req, file, cb) {
        const uniqueName = String(Date.now());
        cb(null, uniqueName + ".jpg");
    }
});

const uploadProfile = multer({ storage: storageProfile });


const storagePost = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "imgs/postImg");
    },
    filename: function (req, file, cb) {
        const uniqueName = String(Date.now());
        cb(null, uniqueName + '.jpg');
    }
});

const uploadPost = multer({ storage: storagePost })


module.exports = {uploadProfile, uploadPost}