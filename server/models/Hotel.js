import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    city: { type: String, required: true },
    owner: { type: String, ref: "User", required: true }, // Clerk User ID
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
