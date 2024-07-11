const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const createToken = (email, role, expiry = '1h') => {
    return jwt.sign({ email, role }, process.env.SECRET_KEY, { expiresIn: expiry });
}

//Random String generator
const randString = (length = 10) => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

//Image Uploader
const upload = multer({ storage: multer.memoryStorage() });

const uploader = async (req, res, next) => {
    const files = req.files;

    if (!files) {
        return next();
    }

    try {
        for (const key in files) {
            const file = files[key][0];
            const uniqueFilename = randString(4) + file.originalname;
            const filepath = path.join(__dirname, '../uploads', uniqueFilename);

            await fs.writeFile(filepath, file.buffer);
            file.originalname = uniqueFilename;
            file.path = filepath
        }
        next();
    } catch (err) {
        console.error('Failed to write file:', err);
        return res.status(500).json({ error: 'Failed to save file.' });
    }
}

const uploadFields = upload.fields([
    { name: 'resourceFile', maxCount: 1 },
    { name: 'resourceFrontImage', maxCount: 1 }
]);


module.exports = { createToken, uploadFields, uploader }