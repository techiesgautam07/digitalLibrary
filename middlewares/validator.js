const { uploader } = require('../utils/utilities')


const imageValidator = async (req, res, next) => {
    if (req.file) {
        const { mimetype, size } = req.file;
        const types = process.env.ALLOWED_IMG_TYPES;

        if (!types.includes(mimetype)) {
            return res.status(400).json({ error: 'Invalid File Type' });
        }
        if (size > process.env.ALLOWED_IMG_SIZE) {
            return res.status(400).json({ error: `File size should be less than${process.env.ALLOWED_IMG_SIZE}` });
        }
        uploader(req, res, next);
    } else {
        next();
    }
}

module.exports = { imageValidator };