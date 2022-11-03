const multer = require("multer");

const storageEngine = multer.diskStorage({
    destination: "pictures",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}+"." + ${file.extension}`);
    },
});
// .limits(2000000);

module.exports = multer({ storage: storageEngine }).array;
