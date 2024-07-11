const { uploader } = require('../utils/utilities')


const imageValidator = async (req, res, next) => {
    if (!req.files || !req.files.resourceFile || !req.files.resourceFrontImage) {
        return res.status(400).json({ message: 'Both resource file and resource front image are required.' });
    }

    const imageFile = req.files.resourceFrontImage[0];
    const resourceFile = req.files.resourceFile[0];
    const { mimetype, size } = imageFile;

    if (!process.env.ALLOWED_IMG_TYPES.includes(mimetype)) {
        return res.status(400).json({ error: 'Invalid File Type' });
    }

    if (size > process.env.ALLOWED_IMG_SIZE) {
        return res.status(400).json({ error: `File size should be less than ${allowedImgSize}` });
    }

    if (!process.env.ALLOWED_RESOURCE_TYPES.includes(resourceFile.mimetype)) {
        return res.status(400).json({ error: 'Invalid Resource File Type' });
    }
    if (resourceFile.size > process.env.ALLOWED_RESOURCE_SIZE) {
        return res.status(400).json({ error: `Resource fikle size can't be greater than ${process.env.ALLOWED_RESOURCE_SIZE} MB` });
    }

    uploader(req, res, next);
}

module.exports = { imageValidator };