const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller");


const router = express.Router();

/* - GET /api/chat/ */
router.get("/", authMiddleware.authUser, chatController.getChats);

/* - POST /api/chat/ */
router.post("/", authMiddleware.authUser, chatController.createChat);

/* GET /api/chat/messages/:id */
router.get('/messages/:id', authMiddleware.authUser, chatController.getMessages)


module.exports = router;