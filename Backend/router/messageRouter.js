import express from 'express'
import { getMessageController, getUsersController, sendMessageController } from '../controller/messageController'
import verifyToken from '../middleware/verifyToken'
import upload from '../utils/multer'

const router = express.Router()

router.get('/get/users', verifyToken, getUsersController)
router.get('/get/message/:id', verifyToken, getMessageController)
router.post('/send/:id', verifyToken, upload.fields([{name: 'image', maxCount: 1}]), sendMessageController)

export default router