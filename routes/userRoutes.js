const express = require('express');
const router = express.Router();
const { signin, signup, sendResourceRequest } = require('../controllers/userController');
const { authorize } = require('../middlewares/auth');




router.post('/api/signup', signup)
router.post('/api/signin', signin),
    router.post('/api/request', authorize, sendResourceRequest)


router.get('/', (req, res) => {
    res.status(200).json({ message: "Hello!" });
});

module.exports = router;