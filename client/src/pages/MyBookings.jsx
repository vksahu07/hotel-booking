import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useUser } from "@clerk/clerk-react";
import { apiRequest } from "../config/api";

const MyBookings = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiRequest("/api/bookings/my-bookings", {}, user.id);
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, [user]);

  const handlePayment = async (bookingId) => {
    if (!user) return;
    try {
      const data = await apiRequest(`/api/bookings/pay/${bookingId}`, {
        method: "PUT"
      }, user.id);
      
      alert(data.message || "Payment successful!");
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, isPaid: true } : b));
    } catch (err) {
      alert(err.message || "Payment failed");
    }
  };

  if (loading) {
    return <p className="py-40 text-center text-gray-500">Loading bookings...</p>;
  }

  return (
    <div className="pt-24 pb-12 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel resevations in one place. Plan your trips seamlessly with just a few clicks"
        align="left"
      />
      <div className="max-w-6xl mt-8 w-full text-gray-800">
        {!user ? (
          <p className="text-gray-500 text-lg py-10">Please log in to view your bookings.</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 text-lg py-10">You have no active bookings.</p>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
              <div className="w-1/3">Hotels</div>
              <div className="w-1/3">Date & Timings</div>
              <div className="w-1/3">Payment</div>
            </div>
            {bookings.map((bookingItem) => (
              <div
                key={bookingItem._id}
                className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
              >
                {/* Hotel Details */}
                <div className="flex flex-col md:flex-row">
                  <img
                    src={bookingItem.room?.images?.[0] || "https://images.unsplash.com/photo-1611891487122-2075b96244e1?q=80&w=600"}
                    alt="hotel-img"
                    className="md:w-44 rounded shadow object-cover"
                  />
                  <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                    <p className="font-playfair text-2xl">
                      {bookingItem.hotel?.name || "Premium Suite"}
                      <span className="font-inter text-sm ml-2 text-gray-500">
                        ({bookingItem.room?.roomType || "Standard"})
                      </span>
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <img
                        src={assets.locationIcon}
                        alt="location-icon"
                        className="w-4 h-4"
                      />
                      <span>{bookingItem.hotel?.address || "Address not specified"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <img src={assets.guestsIcon} alt="guests-icon" />
                      <span>Guests: {bookingItem.guests}</span>
                    </div>
                    <p className="text-base font-medium">Total: ${bookingItem.totalPrice}</p>
                  </div>
                </div>
                {/* Date & Timings */}
                <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                  <div>
                    <p className="font-medium text-sm text-gray-700">Check-In:</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(bookingItem.checkInDate).toDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-700">Check-Out:</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(bookingItem.checkOutDate).toDateString()}
                    </p>
                  </div>
                </div>
                {/* Payment Status */}
                <div className="flex flex-col items-start justify-center pt-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${bookingItem.isPaid ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <p
                      className={`text-sm ${bookingItem.isPaid ? "text-green-500" : "text-red-500"}`}
                    >
                      {bookingItem.isPaid ? "Paid" : "Unpaid"}
                    </p>
                  </div>
                  {!bookingItem.isPaid && (
                    <button 
                      onClick={() => handlePayment(bookingItem._id)}
                      className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
