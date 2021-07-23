const multer = require('multer');

const { BOOK_STORE_PATH } = require('../consts');

const allowedTypes = ['text/plain'];

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, BOOK_STORE_PATH)
    },
    filename(req, file, cb) {
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`)
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

module.exports = multer({
    storage, fileFilter
});
