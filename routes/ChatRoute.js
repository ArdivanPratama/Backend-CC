import express from "express";
import { createChat } from "../controllers/Chat.js";

const router = express.Router();

// Route untuk membuat chat baru
router.post("/chats", createChat);

export default router;
