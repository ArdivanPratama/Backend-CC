import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import RepairShop from "./RepairShopsModel.js";

const OperationalSchedule = db.define(
  "OperationalSchedule",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    openingTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    closingTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("open", "closed"),
      allowNull: false,
    },
    repairShopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

OperationalSchedule.belongsTo(RepairShop, {
  foreignKey: "repairShopId",
});
RepairShop.hasMany(OperationalSchedule);

export default OperationalSchedule;
