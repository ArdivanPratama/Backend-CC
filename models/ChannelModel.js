import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import UserModel from "./UserModel.js";
import ChatModel from "./ChatModel.js";

const ChatChannelModel = db.define(
  "ChatChannel",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "chatchannels",
  }
);

ChatChannelModel.belongsTo(UserModel, { foreignKey: "userId" });
ChatChannelModel.belongsTo(UserModel, { foreignKey: "repairShopId" });
ChatChannelModel.hasMany(ChatModel, { foreignKey: "chatChannelId" });

export default ChatChannelModel;
