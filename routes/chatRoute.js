const { chat, getChat } = require("../controllers/chatController");
const express = require('express')


const router = express.Router()

router.post('/api/chat',chat)
router.get('/api/chat',getChat)


module.exports = router