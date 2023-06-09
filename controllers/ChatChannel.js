import ChatChannelModel from "../models/ChannelModel.js";
import ChatModel from "../models/ChatModel.js";
import UserModel from "../models/UserModel.js";

// Mendapatkan semua channel chat
export const getAllChatChannels = async (req, res) => {
  try {
    const chatChannels = await ChatChannelModel.findAll({
      include: [
        {
          model: UserModel,
          as: "user",
        },
        {
          model: UserModel,
          as: "admin",
        },
      ],
    });

    res.status(200).json(chatChannels);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve chat channels" });
  }
};

// Mendapatkan semua chat pada suatu channel
export const getAllChatsInChannel = async (req, res) => {
  const { channelId } = req.params;
  try {
    const chats = await ChatModel.findAll({
      where: { chatChannelId: channelId },
    });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve chats in channel" });
  }
};

// Membuat channel chat baru
export const createChatChannel = async (req, res) => {
  const { userId, repairShopId } = req.body;
  try {
    const chatChannel = await ChatChannelModel.create({
      userId,
      repairShopId,
    });

    res.status(201).json(chatChannel);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat channel" });
  }
};

// Mengirim pesan baru dalam suatu channel
export const createChatMessage = async (req, res) => {
  const { channelId, sender, receiver, message } = req.body;
  try {
    const chatMessage = await ChatModel.create({
      chatChannelId: channelId,
      sender,
      receiver,
      message,
    });

    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat message" });
  }
};
