const express = require('express')
const router = express.Router()
const { getMessageController, getUsersController, sendMessageController } = require('../controller/messageController')
const verifyToken = require('../middleware/verifyToken')
const upload = require('../utils/multer')

router.get('/get/users', verifyToken, getUsersController)
router.get('/get/message/:id', verifyToken, getMessageController)
router.post('/send/:id', verifyToken, upload.fields([{name: 'image', maxCount: 1}]), sendMessageController)

module.exports = router