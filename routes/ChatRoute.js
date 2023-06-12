import express from "express";
import { createChat } from "../controllers/Chat.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

// Route untuk membuat chat baru
router.post("/chats", verifyUser, createChat);

export default router;
