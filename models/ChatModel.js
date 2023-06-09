import { DataTypes, literal } from "sequelize";
import db from "../config/Database.js";
import UserModel from "./UserModel.js";

const ChatModel = db.define("Chat", {
  uuid: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiver: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: literal("CURRENT_TIMESTAMP"), // Menggunakan CURRENT_TIMESTAMP untuk mendapatkan waktu saat ini
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

ChatModel.belongsTo(UserModel, { foreignKey: "sender", as: "senderUser" });
ChatModel.belongsTo(UserModel, { foreignKey: "receiver", as: "receiverUser" });
UserModel.hasMany(ChatModel, { foreignKey: "sender", as: "sentChats" });
UserModel.hasMany(ChatModel, { foreignKey: "receiver", as: "receivedChats" });

export default ChatModel;
