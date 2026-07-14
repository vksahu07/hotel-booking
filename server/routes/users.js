import express from "express";
import { getUserProfile, registerHotel } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Retrieve user details
router.get("/profile", requireAuth, getUserProfile);

// Register a hotel (updates user role to hotelOwner)
router.post("/register-hotel", requireAuth, registerHotel);

export default router;
