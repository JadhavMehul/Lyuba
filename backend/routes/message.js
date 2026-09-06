const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, getChats } = require("../controllers/messageController");
const { verifyToken } = require("../middleware/auth");


router.post("/sendMessage", verifyToken, sendMessage)
router.post("/getMessage", verifyToken, getMessages)
router.post("/getChats", verifyToken, getChats)

module.exports = router;
