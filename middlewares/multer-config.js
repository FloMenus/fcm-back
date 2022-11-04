const multer = require("multer");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/svg": "svg",
};

const storageEngine = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public");
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        callback(null, `${Date.now()}.${extension}`);
    },
});

module.exports = multer({
    storage: storageEngine,
    limits: { fileSize: 2000000 },
    errorHandling: "manual",
});
