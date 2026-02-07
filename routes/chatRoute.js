const { chat } = require("../controllers/chatController");
const express = require('express')


const router = express.Router()

router.post('/api/chat',chat)


module.exports = router