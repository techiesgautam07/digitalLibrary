const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const createToken = (email, expiry = '1h') => {
    return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: expiry });
}

//Random String generator
const randString = (length = 10) => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

//Image Uploader
const upload = multer({ storage: multer.memoryStorage() });

const uploader = async (req, res, next) => {
    const uniqueFilename = randString(4) + req.file.originalname;
    const filepath = path.join(__dirname, '../uploads', uniqueFilename);

    try {
        await fs.writeFile(filepath, req.file.buffer);
        req.file.originalname = uniqueFilename;
        next();
    } catch (err) {
        console.error('Failed to write file:', err);
        return res.status(500).json({ error: 'Failed to save file.' });
    }
}


module.exports = { createToken, upload, uploader }