import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  assets,
  facilityIcons,
  roomCommonData,
} from "../assets/assets";
import StarRating from "../components/StarRating";
import { apiRequest } from "../config/api";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form inputs
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Pay At Hotel");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const data = await apiRequest(`/api/rooms/details/${id}`);
        if (data.success) {
          setRoom(data.room);
          if (data.room.images && data.room.images.length > 0) {
            setMainImage(data.room.images[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching room details:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      openSignIn();
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (days <= 0) {
      alert("Check-out date must be after Check-in date.");
      return;
    }

    const totalPrice = days * room.pricePerNight;
    
    setBookingLoading(true);
    try {
      const data = await apiRequest("/api/bookings/create", {
        method: "POST",
        body: JSON.stringify({
          room: id,
          checkInDate,
          checkOutDate,
          totalPrice,
          guests,
          paymentMethod
        }),
      }, user.id);

      alert(data.message || "Booking created successfully!");
      navigate("/my-bookings");
    } catch (err) {
      alert(err.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <p className="py-40 text-center text-gray-500">Loading room details...</p>;
  }

  if (!room) {
    return <p className="py-40 text-center text-red-500">Room not found.</p>;
  }

  return (
    <div className="pt-24 pb-12 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Room Details */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room.hotel?.name || "Premium Suite"}{" "}
          <span className="font-inter text-sm">({room.roomType})</span>
        </h1>
        <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
          20% OFF
        </p>
      </div>
      {/* Room Rating */}
      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2 text-sm text-gray-500">200+ reviews</p>
      </div>
      {/* Room Address */}
      <div className="flex items-center gap-1 text-gray-500 mt-2">
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{room.hotel?.address || "Address not available"}</span>
      </div>
      {/* Room Images */}
      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="lg:w-1/2 w-full">
          <img
            src={mainImage || "https://images.unsplash.com/photo-1611891487122-2075b96244e1?q=80&w=600"}
            alt="Room image"
            className="w-full h-80 rounded-xl shadow-lg object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {room?.images && room.images.length > 0 ? (
            room.images.map((image, index) => (
              <img
                onClick={() => setMainImage(image)}
                key={index}
                src={image}
                alt="Room Image"
                className={`w-full h-36 rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && "outline-3 outline-orange-500"}`}
              />
            ))
          ) : (
            <p className="text-gray-400">No additional images</p>
          )}
        </div>
      </div>
      {/* Room Highlights */}
      <div className="flex flex-col md:flex-row md:justify-between mt-10">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-playfair">
            Experience Luxury Like Never Before
          </h1>
          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {room.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
              >
                {facilityIcons[item] && (
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />
                )}
                <p className="text-xs">{item}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Room Price */}
        <p className="text-2xl font-medium">${room.pricePerNight}/night</p>
      </div>
      {/* CheckIn CheckOut Form */}
      <form onSubmit={handleBooking} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl w-full">
        <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500 w-full md:w-auto">
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="checkInDate" className="font-medium">
              Check-In
            </label>
            <input
              type="date"
              id="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>
          <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="checkOutDate" className="font-medium">
              Check-Out
            </label>
            <input
              type="date"
              id="checkOutDate"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>

          <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="guests" className="font-medium">
              Guests
            </label>
            <input
              type="number"
              id="guests"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              placeholder="1"
              className="w-full md:max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>

          <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="paymentMethod" className="font-medium">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none bg-white"
            >
              <option value="Pay At Hotel">Pay At Hotel</option>
              <option value="Stripe">Stripe / Card</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={bookingLoading}
          className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer disabled:opacity-50"
        >
          {bookingLoading ? "Booking..." : "Book Now"}
        </button>
      </form>

      {/* Common Specifications */}
      <div className="mt-12 space-y-4">
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <img
              src={spec.icon}
              alt={`${spec.title}-icon`}
              className="w-6.5"
            />
            <div>
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-3xl border-y border-gray-300 my-8 py-10 text-gray-500">
        <p>
          Guests will be allocated on the ground floor according to
          availability, you get a comfortable room with a true city feeling. 
          The price quoted is per night. Make sure to specify check-in/out 
          dates to finalize the booking details.
        </p>
      </div>
      {/* Hosted by */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <img
            src={room.hotel?.owner?.image || "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2N2c5YVpSSEFVYVUxbmVYZ2JkSVVuWnFzWSJ9"}
            alt="Host"
            className="h-14 w-14 md:h-18 rounded-full"
          />
          <div>
            <p className="text-lg md:text-xl">Hosted by {room.hotel?.name || "Hotel Owner"}</p>
            <div className="flex items-center mt-1">
              <StarRating />
              <p className="ml-2 text-sm text-gray-500">200+ reviews</p>
            </div>
          </div>
        </div>
        <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;
