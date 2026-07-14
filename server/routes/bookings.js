import express from "express";
import { createBooking, getUserBookings, getOwnerDashboardStats, payBooking } from "../controllers/bookingController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Protected booking endpoints
router.post("/create", requireAuth, createBooking);
router.get("/my-bookings", requireAuth, getUserBookings);
router.get("/owner-dashboard", requireAuth, getOwnerDashboardStats);
router.put("/pay/:id", requireAuth, payBooking);

export default router;
