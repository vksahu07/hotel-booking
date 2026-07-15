import React, { useState, useEffect } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { apiRequest } from "../config/api";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFilters, setOpenFilters] = useState(false);

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortType, setSortType] = useState("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRange = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];
  const sortOption = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  // Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const cityQuery = searchParams.get("city");
        const endpoint = cityQuery ? `/api/rooms/all?city=${encodeURIComponent(cityQuery)}` : "/api/rooms/all";
        const data = await apiRequest(endpoint);
        if (data.success) {
          setRooms(data.rooms);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [searchParams]);

  // Filter Handlers
  const handleTypeChange = (checked, label) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, label]);
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== label));
    }
  };

  const handlePriceChange = (checked, label) => {
    // Label is like "$ 0 to 500"
    const cleanLabel = label.replace("$ ", "");
    if (checked) {
      setSelectedPrices([...selectedPrices, cleanLabel]);
    } else {
      setSelectedPrices(selectedPrices.filter((p) => p !== cleanLabel));
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedPrices([]);
    setSortType("");
  };

  // Filter & Sort Logic
  const getFilteredRooms = () => {
    let list = [...rooms];

    // Filter by type
    if (selectedTypes.length > 0) {
      list = list.filter((r) => selectedTypes.includes(r.roomType));
    }

    // Filter by price
    if (selectedPrices.length > 0) {
      list = list.filter((r) => {
        return selectedPrices.some((rangeStr) => {
          const [min, max] = rangeStr.split(" to ").map(Number);
          return r.pricePerNight >= min && r.pricePerNight <= max;
        });
      });
    }

    // Sort
    if (sortType === "Price Low to High") {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortType === "Price High to Low") {
      list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortType === "Newest First") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  };

  const filteredRooms = getFilteredRooms();

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-24 pb-12 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
          {searchParams.get("city") && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200/60 rounded-lg px-4 py-2 mt-4 text-sm text-blue-800">
              <span>Showing rooms in <strong>"{searchParams.get("city")}"</strong></span>
              <button
                onClick={() => setSearchParams({})}
                className="font-semibold text-blue-600 hover:text-blue-900 underline cursor-pointer"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="py-20 text-gray-500">Loading rooms...</p>
        ) : filteredRooms.length === 0 ? (
          <p className="py-20 text-gray-500 text-lg">No rooms match your filters.</p>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-12 last:border-0"
            >
              <img
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                src={getOptimizedImageUrl(room.images?.[0], 600) || "https://images.unsplash.com/photo-1611891487122-2075b96244e1?q=80&w=600"}
                alt="hotel-img"
                title="View Room Details"
                className="max-h-65 w-full md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
                loading="lazy"
              />
              <div className="w-full md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">{room.hotel?.city || "Unknown City"}</p>
                <p
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);
                    scrollTo(0, 0);
                  }}
                  className="text-gray-800 text-3xl font-playfair cursor-pointer"
                >
                  {room.hotel?.name || "Premium Suite"}
                </p>
                <div className="flex items-center">
                  <StarRating />
                  <p className="ml-2 text-sm text-gray-500">200+ reviews</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="location-icon" />
                  <span>{room.hotel?.address || "Address not available"}</span>
                </div>
                {/* Room Amenities */}
                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {room.amenities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
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
                {/*Room price per Night */}
                <p className="text-xl font-medium text-gray-700">
                  ${room.pricePerNight}/night
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filters */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-300 ${openFilters && "border-b"}`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span onClick={clearFilters} className="hidden lg:block">CLEAR</span>
          </div>
        </div>
        <div
          className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedTypes.includes(room)}
                onChange={handleTypeChange}
              />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRange.map((range, index) => (
              <CheckBox
                key={index}
                label={`$ ${range}`}
                selected={selectedPrices.includes(range)}
                onChange={handlePriceChange}
              />
            ))}
          </div>
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOption.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={sortType === option}
                onChange={setSortType}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
