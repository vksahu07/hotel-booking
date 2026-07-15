import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Add a new room for the owner's hotel
export const addRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const userId = req.userId;

    if (!roomType || !pricePerNight) {
      return res.status(400).json({ success: false, message: "Room type and price are required" });
    }

    // Find the hotel owned by this user
    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "You need to register a hotel first before adding rooms" });
    }

    // Parse amenities
    let parsedAmenities = [];
    if (amenities) {
      parsedAmenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities;
    }

    // Process uploaded images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
            folder: "hotel_bookings",
          });
          imageUrls.push(uploadResult.secure_url);
          // Delete local file after upload
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (uploadError) {
          console.error("Cloudinary upload failed for file:", file.path, uploadError.message);
          // Still clean up local file if upload failed
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          throw new Error("Failed to upload room images to Cloudinary");
        }
      }
    }

    const room = await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: parsedAmenities,
      images: imageUrls,
      isAvailable: true
    });

    res.status(201).json({ success: true, message: "Room added successfully", room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch rooms listed by the logged-in owner
export const getOwnerRooms = async (req, res) => {
  try {
    const userId = req.userId;

    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.status(200).json({ success: true, rooms: [] }); // No hotel, so no rooms
    }

    const rooms = await Room.find({ hotel: hotel._id });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all available rooms (with filters)
export const getAllRooms = async (req, res) => {
  try {
    const { roomType, minPrice, maxPrice, city, sort } = req.query;

    const query = { isAvailable: true };

    // Handle room type filtering
    if (roomType) {
      query.roomType = roomType;
    }

    // Handle price filtering
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Fetch all rooms and populate their hotel details
    let rooms = await Room.find(query).populate("hotel");

    // Filter by hotel city if provided
    if (city) {
      rooms = rooms.filter(room => room.hotel && room.hotel.city.toLowerCase() === city.toLowerCase());
    }

    // Sort options
    if (sort) {
      if (sort === "low-to-high") {
        rooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
      } else if (sort === "high-to-low") {
        rooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
      } else if (sort === "newest") {
        rooms.sort((a, b) => b.createdAt - a.createdAt);
      }
    }

    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch room details by ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel");
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle room availability
export const toggleAvailability = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.json({ success: true, message: `Room availability set to ${room.isAvailable}`, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper to extract Cloudinary public ID from URL
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
      let pathParts = parts.slice(uploadIndex + 1);
      // Skip version folder if present (e.g. v12345678)
      if (pathParts[0].startsWith("v") && /^\d+$/.test(pathParts[0].slice(1))) {
        pathParts = pathParts.slice(1);
      }
      const fileWithExt = pathParts.join("/");
      const publicId = fileWithExt.substring(0, fileWithExt.lastIndexOf("."));
      return publicId;
    }
  } catch (error) {
    console.error("Failed to parse public ID from url:", url, error);
  }
  return null;
};

// Delete room along with its Cloudinary images
export const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const userId = req.userId;

    const room = await Room.findById(roomId).populate("hotel");
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // Verify room ownership
    if (!room.hotel || room.hotel.owner !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this room" });
    }

    // Delete images from Cloudinary or local disk
    if (room.images && room.images.length > 0) {
      const uploadDir = process.env.VERCEL ? "/tmp" : "./uploads";
      for (const imageUrl of room.images) {
        if (imageUrl.includes("cloudinary.com")) {
          const publicId = getPublicIdFromUrl(imageUrl);
          if (publicId) {
            try {
              await cloudinary.uploader.destroy(publicId);
            } catch (destroyError) {
              console.error("Failed to delete image from Cloudinary:", publicId, destroyError.message);
            }
          }
        } else if (imageUrl.includes("/uploads/")) {
          const filename = imageUrl.split("/uploads/")[1];
          const filePath = `${uploadDir}/${filename}`;
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log("Local file deleted successfully:", filePath);
            } catch (unlinkError) {
              console.error("Failed to delete local file:", filePath, unlinkError.message);
            }
          }
        }
      }
    }

    // Delete room document
    await Room.findByIdAndDelete(roomId);

    res.json({ success: true, message: "Room and associated images deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
