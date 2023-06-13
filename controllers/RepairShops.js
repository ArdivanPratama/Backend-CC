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

// Initialize multer with GCS storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit the file size to 5MB
  },
});

// Create a new repair shop with image upload (only for admin role)
export const createRepairShop = async (req, res) => {
  try {
    // Check user's role
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Upload image to GCS
    upload.single("image")(req, res, async (error) => {
      if (error instanceof multer.MulterError) {
        // Error during image upload
        return res.status(500).json({ error: "Failed to upload image" });
      } else if (error) {
        // Other errors
        return res.status(500).json({ error: "Something went wrong" });
      }

      // Get the uploaded image file from the buffer
      const imageFile = req.file;

      // Generate a unique file name
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(imageFile.originalname);
      const fileName = `image-${uniqueSuffix}${extension}`;

      // Save the image file to GCS
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
          // Create a new repair shop with the data and image path
          const repairShop = await RepairShop.create({
            ...req.body,
            image: fileName,
            userId: req.userId, // Assign the logged-in user ID to the repair shop
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

// Get all repair shops
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

// Get repair shop by ID
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

// Update repair shop (only for admin role)
export const updateRepairShop = async (req, res) => {
  try {
    // Check user's role
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const repairShop = await RepairShop.findByPk(req.params.id);
    if (!repairShop) {
      return res.status(404).json({ error: "Repair shop not found" });
    }

    // Upload image to GCS
    upload.single("image")(req, res, async (error) => {
      if (error instanceof multer.MulterError) {
        // Error during image upload
        return res.status(500).json({ error: "Failed to upload image" });
      } else if (error) {
        // Other errors
        return res.status(500).json({ error: "Something went wrong" });
      }

      // Get the uploaded image file from the buffer
      const imageFile = req.file;

      // If an image is uploaded, save it to GCS
      if (imageFile) {
        // Generate a unique file name
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(imageFile.originalname);
        const fileName = `image-${uniqueSuffix}${extension}`;

        // Save the image file to GCS
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
            // Update the repair shop with the new data and image path
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
        // If no image is uploaded, only update the repair shop data
        await repairShop.update(req.body);
        res.status(200).json({ message: "Repair shop updated successfully" });
      }
    });
  } catch (error) {
    console.error("Failed to update repair shop:", error);
    res.status(500).json({ error: "Failed to update repair shop" });
  }
};

// Delete repair shop
export const deleteRepairShop = async (req, res) => {
  try {
    // Check user's role
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const repairShop = await RepairShop.findByPk(req.params.id);
    if (!repairShop) {
      return res.status(404).json({ error: "Repair shop not found" });
    }

    // Delete the image file from GCS
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
