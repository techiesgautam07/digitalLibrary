const express = require('express');
const router = express.Router();
const { imageValidator } = require('../middlewares/validator');
const { upload } = require('../utils/utilities');
const { resourceUpload, signup, adminApprove, getAllRequest, getOneRequest, getAllUser, getOneUser } = require('../controllers/adminController');
const { authorize } = require('../middlewares/auth');


router.post('/api/adminsignup', signup)
router.post('/api/uploadresource', authorize, upload.single("file"), imageValidator, resourceUpload)
router.get('/api/approve/:reqId', authorize, adminApprove),
    router.get('/api/admin/requests/:reqId', authorize, getOneRequest)
router.get('/api/admin/requests', authorize, getAllRequest)
router.get('/api/admin/users', authorize, getAllUser)
router.get('/api/admin/users/:id', authorize, getOneUser);


module.exports = router;