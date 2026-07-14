import React, { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../config/api";

const FeaturedDestination = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await apiRequest("/api/rooms/all");
        if (data.success) {
          setRooms(data.rooms);
        }
      } catch (err) {
        console.error("Error fetching featured rooms:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Featured Destinations"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />
      
      {loading ? (
        <p className="mt-20 text-gray-500">Loading featured destinations...</p>
      ) : rooms.length === 0 ? (
        <p className="mt-20 text-gray-500">No destinations available at the moment.</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {rooms.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>
      )}

      <button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
      >
        View All Destinations
      </button>
    </div>
  );
};

export default FeaturedDestination;
