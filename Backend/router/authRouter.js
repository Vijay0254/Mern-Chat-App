import express from 'express'
import { signupController, loginController, logoutController, verifyTokenController, updateProfileController } from '../controller/authController.js'
import verifyToken from '../middleware/verifyToken.js'
import upload from '../utils/multer.js'
const router = express.Router()

router.post('/signup', signupController)
router.post('/login', loginController)
router.get('/logout', logoutController)
router.get('/verify', verifyToken, verifyTokenController)
router.put('/update/profile', verifyToken, upload.fields([{name: 'profilePic', maxCount: 1}]), updateProfileController)

export default router