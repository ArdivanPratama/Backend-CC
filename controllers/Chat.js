import ChatModel from "../models/ChatModel.js";

// Menangani permintaan untuk membuat chat baru antara admin dan user
const createChat = async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    // Memeriksa peran (role) pengguna
    if (req.role !== "admin" && req.user.role !== "user") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const datetime = new Date(); // Mendapatkan waktu saat ini

    const newChat = await ChatModel.create({
      sender,
      receiver,
      datetime,
      message,
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export { createChat };
