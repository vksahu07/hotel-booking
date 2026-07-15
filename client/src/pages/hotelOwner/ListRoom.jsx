import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useUser } from "@clerk/clerk-react";
import { apiRequest } from "../../config/api";

const ListRoom = () => {
  const { user } = useUser();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    if (!user) return;
    try {
      const data = await apiRequest("/api/rooms/owner-rooms", {}, user.id);
      if (data.success) {
        setRooms(data.rooms);
      }
    } catch (err) {
      console.error("Error fetching listed rooms:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [user]);

  const handleToggleAvailability = async (roomId, index) => {
    if (!user) return;
    try {
      const data = await apiRequest(`/api/rooms/toggle-availability/${roomId}`, {
        method: "PUT"
      }, user.id);

      if (data.success) {
        setRooms(rooms.map((room, i) => i === index ? { ...room, isAvailable: data.room.isAvailable } : room));
      }
    } catch (err) {
      alert(err.message || "Failed to toggle availability");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this room and all its images from Cloudinary?")) {
      return;
    }
    try {
      const data = await apiRequest(`/api/rooms/delete/${roomId}`, {
        method: "DELETE"
      }, user.id);

      if (data.success) {
        alert(data.message || "Room deleted successfully");
        setRooms(rooms.filter(room => room._id !== roomId));
      }
    } catch (err) {
      alert(err.message || "Failed to delete room");
    }
  };

  if (loading) {
    return <p className="text-gray-500 py-10">Loading rooms...</p>;
  }

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />
      <p className="text-gray-500 mt-8">All Rooms</p>
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Facility
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium">
                Price / night
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  No rooms listed yet. Click "Add Room" to get started!
                </td>
              </tr>
            ) : (
              rooms.map((item, index) => (
                <tr key={item._id}>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {item.roomType}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                    {item.amenities?.join(", ") || "None"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    ${item.pricePerNight}
                  </td>

                  <td className="py-3 px-4 border-t border-gray-300 text-sm">
                    <div className="flex items-center justify-center gap-4">
                      <label
                        className="relative inline-flex items-center cursor-pointer text-gray-900"
                      >
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={item.isAvailable} 
                          onChange={() => handleToggleAvailability(item._id, index)} 
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200 relative">
                          <span className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${item.isAvailable ? "translate-x-5" : ""}`}>
                            
                          </span>
                        </div>
                      </label>
                      <button 
                        onClick={() => handleDeleteRoom(item._id)}
                        className="p-1.5 rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors duration-150 cursor-pointer"
                        title="Delete Room"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;
