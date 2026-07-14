import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { room: roomId, checkInDate, checkOutDate, totalPrice, guests, paymentMethod } = req.body;
    const userId = req.userId;

    if (!roomId || !checkInDate || !checkOutDate || !totalPrice) {
      return res.status(400).json({ success: false, message: "Missing required booking details" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const booking = await Booking.create({
      user: userId,
      room: roomId,
      hotel: room.hotel,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      totalPrice: Number(totalPrice),
      guests: Number(guests || 1),
      paymentMethod: paymentMethod || "Pay At Hotel",
      isPaid: paymentMethod === "Stripe" ? true : false, // mark paid if stripe (mock)
      status: "pending"
    });

    res.status(201).json({ success: true, message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch bookings of the logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({ user: userId })
      .populate("room")
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch owner dashboard statistics (revenue and bookings)
export const getOwnerDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Find owner's hotel
    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.json({
        success: true,
        stats: {
          totalBookings: 0,
          totalRevenue: 0,
          bookings: []
        }
      });
    }

    // Find all bookings for this hotel
    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room")
      .populate("user")
      .sort({ createdAt: -1 });

    // Calculate metrics
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    res.json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        bookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process booking payment
export const payBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user !== req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized to pay for this booking" });
    }

    booking.isPaid = true;
    booking.status = "confirmed";
    await booking.save();

    res.json({ success: true, message: "Payment processed successfully!", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
