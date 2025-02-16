const express = require('express')
const router = express.Router()
const { signupController, loginController, logoutController, verifyTokenController, updateProfileController } = require('../controller/authController')
const verifyToken = require('../middleware/verifyToken')
const upload = require('../utils/multer')

router.post('/signup', signupController)
router.post('/login', loginController)
router.get('/logout', logoutController)
router.get('/verify', verifyToken, verifyTokenController)
router.put('/update/profile', verifyToken, upload.fields([{name: 'profilePic', maxCount: 1}]), updateProfileController)

module.exports = router