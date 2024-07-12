const express = require('express');
const router = express.Router();
const { signin, signup, sendResourceRequest, getResources, getOneResource, getAllowedResources } = require('../controllers/userController');
const { authorize } = require('../middlewares/auth');
const { upload } = require('../utils/utilities')
const { singleImageValidator } = require('../middlewares/validator');




router.post('/api/signup', upload.single("image"), singleImageValidator, signup)
router.post('/api/signin', signin)
router.get('/api/request/:resourceId', authorize, sendResourceRequest)
router.get('/api/resources', authorize, getResources)
router.get('/api/resources/:id', authorize, getOneResource)
router.get('/api/allowedresources', authorize, getAllowedResources)


router.get('/', (req, res) => {
    res.status(200).json({ message: "Hello!" });
});

module.exports = router;