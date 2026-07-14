import User from "../models/User.js";
import Hotel from "../models/Hotel.js";

// Get logged-in user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found in database" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register hotel and make user a hotelOwner
export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const userId = req.userId;

    if (!name || !address || !contact || !city) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already owns a hotel
    const existingHotel = await Hotel.findOne({ owner: userId });
    if (existingHotel) {
      return res.status(400).json({ success: false, message: "You have already registered a hotel" });
    }

    // Create the Hotel
    const hotel = await Hotel.create({
      name,
      address,
      contact,
      city,
      owner: userId
    });

    // Update user's role to hotelOwner
    await User.findByIdAndUpdate(userId, { role: "hotelOwner" });

    res.status(201).json({ success: true, message: "Hotel registered successfully", hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
