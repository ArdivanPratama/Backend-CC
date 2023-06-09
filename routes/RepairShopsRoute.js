import express from "express";
import {
  createRepairShop,
  getRepairShops,
  getRepairShopById,
  updateRepairShop,
  deleteRepairShop,
} from "../controllers/RepairShops.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post("/repairshops", verifyUser, adminOnly, createRepairShop);
router.get("/repairshops", verifyUser, getRepairShops);
router.get("/repairshops/:id", verifyUser, getRepairShopById);
router.patch("/repairshops/:id", verifyUser, adminOnly, updateRepairShop);
router.delete("/repairshops/:id", verifyUser, adminOnly, deleteRepairShop);

export default router;
