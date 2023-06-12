import express from "express";
import {
  getAllChatChannels,
  getAllChatsInChannel,
  createChatChannel,
  createChatMessage,
} from "../controllers/ChatChannel.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

// Mendapatkan semua channel chat
router.get("/chatchannels", verifyUser, getAllChatChannels);

// Mendapatkan semua chat pada suatu channel
router.get("/chatchannels/:channelId/chats", verifyUser, getAllChatsInChannel);

// Membuat channel chat baru
router.post("/chatchannels", verifyUser, createChatChannel);

// Mengirim pesan baru dalam suatu channel
router.post("/chatchannels/:channelId/chats", verifyUser, createChatMessage);

export default router;
