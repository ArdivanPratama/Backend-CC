import RepairShop from "../models/RepairShopsModel.js";
import User from "../models/UserModel.js";

// Membuat repair shop baru
export const createRepairShop = async (req, res) => {
  try {
    // Memeriksa peran (role) pengguna
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const repairShop = await RepairShop.create(req.body);
    res.status(201).json(repairShop);
  } catch (error) {
    res.status(500).json({ error: "Failed to create repair shop" });
  }
};

// Mendapatkan semua repair shop
export const getRepairShops = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await RepairShop.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
          },
        ],
      });
    } else {
      response = await RepairShop.findAll({
        include: [
          {
            model: User,
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Mendapatkan repair shop berdasarkan ID
export const getRepairShopById = async (req, res) => {
  const { id } = req.params;
  try {
    const repairShop = await RepairShop.findByPk(id);
    if (repairShop) {
      res.status(200).json(repairShop);
    } else {
      res.status(404).json({ error: "Repair shop not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve repair shop" });
  }
};

// Mengupdate repair shop
export const updateRepairShop = async (req, res) => {
  try {
    // Memeriksa peran (role) pengguna
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const repairShop = await RepairShop.findByPk(req.params.id);
    if (!repairShop) {
      return res.status(404).json({ error: "Repair shop not found" });
    }

    await repairShop.update(req.body);
    res.status(200).json({ message: "Repair shop updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update repair shop" });
  }
};

// Menghapus repair shop
export const deleteRepairShop = async (req, res) => {
  try {
    // Memeriksa peran (role) pengguna
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const repairShop = await RepairShop.findByPk(req.params.id);
    if (!repairShop) {
      return res.status(404).json({ error: "Repair shop not found" });
    }

    await repairShop.destroy();
    res.status(200).json({ message: "Repair shop deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete repair shop" });
  }
};
