import express from "express";
import {
  createOperationalSchedule,
  getOperationalSchedulesByRepairShopId,
  updateOperationalSchedule,
  deleteOperationalSchedule,
} from "../controllers/OperationalSchedule.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

// Membuat operational schedule baru
router.post(
  "/operationalschedules",
  verifyUser,
  adminOnly,
  createOperationalSchedule
);

// Mendapatkan semua operational schedules berdasarkan Repair Shop ID
router.get(
  "/operationalschedules/:repairShopId",
  verifyUser,
  getOperationalSchedulesByRepairShopId
);

// Memperbarui operational schedule berdasarkan ID
router.patch(
  "/operationalschedules/:id",
  verifyUser,
  adminOnly,
  updateOperationalSchedule
);

// Menghapus operational schedule berdasarkan ID
router.delete(
  "/operationalschedules/:id",
  verifyUser,
  adminOnly,
  deleteOperationalSchedule
);

export default router;
