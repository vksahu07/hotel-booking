import express from "express";
import multer from "multer";
import fs from "fs";
import { addRoom, getOwnerRooms, getAllRooms, getRoomById, toggleAvailability } from "../controllers/roomController.js";
import { requireAuth } from "../middleware/auth.js";

// Ensure uploads folder exists
const uploadDir = process.env.VERCEL ? "/tmp" : "./uploads";
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn("Could not create uploads directory, falling back to temp dir:", err.message);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
const router = express.Router();

// Public routes
router.get("/all", getAllRooms);
router.get("/details/:id", getRoomById);

// Protected routes (Owner / User)
router.post("/add", requireAuth, upload.array("images", 4), addRoom);
router.get("/owner-rooms", requireAuth, getOwnerRooms);
router.put("/toggle-availability/:id", requireAuth, toggleAvailability);

export default router;
