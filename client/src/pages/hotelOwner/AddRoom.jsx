import React, { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useUser } from "@clerk/clerk-react";
import { apiRequest } from "../../config/api";

const AddRoom = () => {
  const { user } = useUser();
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free WiFi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Pool Access": false,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in first.");
    if (!inputs.roomType) return alert("Please select a room type.");
    if (!inputs.pricePerNight || inputs.pricePerNight <= 0) return alert("Please enter a valid price per night.");

    setLoading(true);

    const formData = new FormData();
    formData.append("roomType", inputs.roomType);
    formData.append("pricePerNight", inputs.pricePerNight);

    // Active amenities array
    const activeAmenities = Object.keys(inputs.amenities).filter(
      (key) => inputs.amenities[key]
    );
    formData.append("amenities", JSON.stringify(activeAmenities));

    // Append images
    Object.keys(images).forEach((key) => {
      if (images[key]) {
        formData.append("images", images[key]);
      }
    });

    try {
      const data = await apiRequest("/api/rooms/add", {
        method: "POST",
        body: formData,
      }, user.id);

      alert(data.message || "Room added successfully!");
      // Reset form
      setImages({ 1: null, 2: null, 3: null, 4: null });
      setInputs({
        roomType: "",
        pricePerNight: 0,
        amenities: {
          "Free WiFi": false,
          "Free Breakfast": false,
          "Room Service": false,
          "Pool Access": false,
        },
      });
    } catch (err) {
      alert(err.message || "Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user bookings experience."
      />
      {/* Upload Area For Images */}

      <p className="text-gray-800 mt-10 font-medium">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img
              className="w-24 h-24 cursor-pointer opacity-80 rounded border border-gray-300 object-cover"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.uploadArea
              }
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
            />
          </label>
        ))}
      </div>
      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            value={inputs.roomType}
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
            required
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div>
          <p className="mt-4 text-gray-800">
            Price <span className="text-xs">/night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
            required
          />
        </div>
      </div>
      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-600 max-w-sm">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index} className="flex items-center gap-2 mt-1.5">
            <input
              type="checkbox"
              id={`amenities-${index + 1}`}
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
            />
            <label htmlFor={`amenities-${index + 1}`} className="text-sm select-none cursor-pointer"> {amenity}</label>
          </div>
        ))}
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="bg-primary hover:bg-primary-dull text-white px-8 py-2 rounded mt-8 cursor-pointer disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Room"}
      </button>
    </form>
  );
};

export default AddRoom;
