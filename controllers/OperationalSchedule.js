import OperationalSchedule from "../models/ScheduleModel.js";

// Membuat operational schedule baru
export const createOperationalSchedule = async (req, res) => {
  try {
    // Memeriksa peran (role) pengguna
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { repairShopId, day, openingTime, closingTime, status } = req.body;
    const operationalSchedule = await OperationalSchedule.create({
      RepairShopId: repairShopId,
      day,
      openingTime,
      closingTime,
      status,
    });
    res.status(201).json(operationalSchedule);
  } catch (error) {
    res.status(500).json({ error: "Failed to create operational schedule" });
  }
};

// Mendapatkan semua operational schedules berdasarkan Repair Shop ID
export const getOperationalSchedulesByRepairShopId = async (req, res) => {
  const { repairShopId } = req.params;
  try {
    const operationalSchedules = await OperationalSchedule.findAll({
      where: { RepairShopId: repairShopId },
    });
    res.status(200).json(operationalSchedules);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve operational schedules" });
  }
};

// Memperbarui operational schedule berdasarkan ID
export const updateOperationalSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    // Memeriksa peran (role) pengguna
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Kode lainnya untuk memperbarui operational schedule
  } catch (error) {
    res.status(500).json({ error: "Failed to update operational schedule" });
  }
};

// Menghapus operational schedule berdasarkan ID
export const deleteOperationalSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    // Memeriksa peran (role) pengguna
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Kode lainnya untuk menghapus operational schedule
  } catch (error) {
    res.status(500).json({ error: "Failed to delete operational schedule" });
  }
};
