import RepairShop from "../models/RepairShopsModel.js";
import User from "../models/UserModel.js";
import multer from "multer";
import path from "path";
import { Storage } from "@google-cloud/storage";

// Initialize the GCS connection
const storage = new Storage({
  projectId: "befine-389610",
  keyFilename: "mykey.json",
});

// Create a GCS bucket reference
const bucket = storage.bucket("image_bucket_befine");

// Inisialisasi multer dengan storage GCS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit the file size to 5MB
  },
});

// Membuat repair shop baru dengan upload gambar (hanya role admin)
export const createRepairShop = async (req, res) => {
  try {
    // Memeriksa peran (role) pengguna
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Upload gambar ke GCS
    upload.single("image")(req, res, async (error) => {
      if (error instanceof multer.MulterError) {
        // Error saat proses upload gambar
        return res.status(500).json({ error: "Failed to upload image" });
      } else if (error) {
        // Error lainnya
        return res.status(500).json({ error: "Something went wrong" });
      }

      // Dapatkan file gambar yang diupload dari buffer
      const imageFile = req.file;

      // Buat nama file yang unik
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(imageFile.originalname);
      const fileName = `image-${uniqueSuffix}${extension}`;

      // Simpan file gambar ke GCS
      const file = bucket.file(fileName);
      const stream = file.createWriteStream({
        resumable: false,
      });
      stream.on("error", (err) => {
        console.error("Error uploading image to GCS:", err);
        res.status(500).json({ error: "Failed to upload image" });
      });
      stream.on("finish", async () => {
        try {
          // Buat repair shop baru dengan data dan path gambar
          const repairShop = await RepairShop.create({
            ...req.body,
            image: fileName,
          });

          res.status(201).json(repairShop);
        } catch (error) {
          console.error("Failed to create repair shop:", error);
          res.status(500).json({ error: "Failed to create repair shop" });
        }
      });
      stream.end(imageFile.buffer);
    });
  } catch (error) {
    console.error("Failed to create repair shop:", error);
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
    res.status(500).json({ error: error.message });
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

// Mengupdate repair shop (hanya role admin)
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

    // Upload gambar ke GCS
    upload.single("image")(req, res, async (error) => {
      if (error instanceof multer.MulterError) {
        // Error saat proses upload gambar
        return res.status(500).json({ error: "Failed to upload image" });
      } else if (error) {
        // Error lainnya
        return res.status(500).json({ error: "Something went wrong" });
      }

      // Dapatkan file gambar yang diupload dari buffer
      const imageFile = req.file;

      // Jika ada gambar yang diupload, simpan ke GCS
      if (imageFile) {
        // Buat nama file yang unik
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(imageFile.originalname);
        const fileName = `image-${uniqueSuffix}${extension}`;

        // Simpan file gambar ke GCS
        const file = bucket.file(fileName);
        const stream = file.createWriteStream({
          resumable: false,
        });
        stream.on("error", (err) => {
          console.error("Error uploading image to GCS:", err);
          res.status(500).json({ error: "Failed to upload image" });
        });
        stream.on("finish", async () => {
          try {
            // Update repair shop dengan data dan path gambar yang baru
            await repairShop.update({
              ...req.body,
              image: fileName,
            });

            res
              .status(200)
              .json({ message: "Repair shop updated successfully" });
          } catch (error) {
            console.error("Failed to update repair shop:", error);
            res.status(500).json({ error: "Failed to update repair shop" });
          }
        });
        stream.end(imageFile.buffer);
      } else {
        // Jika tidak ada gambar yang diupload, hanya update data repair shop
        await repairShop.update(req.body);
        res.status(200).json({ message: "Repair shop updated successfully" });
      }
    });
  } catch (error) {
    console.error("Failed to update repair shop:", error);
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

    // Hapus file gambar dari GCS
    const fileName = repairShop.image;
    if (fileName) {
      const file = bucket.file(fileName);
      await file.delete();
    }

    await repairShop.destroy();
    res.status(200).json({ message: "Repair shop deleted successfully" });
  } catch (error) {
    console.error("Failed to delete repair shop:", error);
    res.status(500).json({ error: "Failed to delete repair shop" });
  }
};
