import React from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";

const Experience = () => {
  const navigate = useNavigate();

  const experiences = [
    {
      title: "Fine Dining",
      tagline: "Gourmet Cuisine",
      description: "Indulge in award-winning culinary creations curated by world-class chefs using fresh local ingredients.",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600",
    },
    {
      title: "Wellness & Spa",
      tagline: "Rejuvenate & Relax",
      description: "Unwind with signature massage therapies, hot stone treatments, and customized facial wellness packages.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
    },
    {
      title: "Infinity Pools",
      tagline: "Swim in Style",
      description: "Enjoy temperature-controlled infinity pools with panoramic views of the city skyline or peaceful landscapes.",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600",
    },
    {
      title: "Guided Adventures",
      tagline: "Explore the City",
      description: "Join curated local tours, guided hiking trips, and exclusive city excursions led by local travel specialists.",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600",
    },
  ];

  const amenities = [
    { name: "24/7 Butler & Concierge Service", icon: "🤵" },
    { name: "Private Airport Transfers", icon: "🚗" },
    { name: "In-Room Gourmet Dining", icon: "🍽️" },
    { name: "Fully-Equipped Fitness Centers", icon: "🏋️‍♂️" },
    { name: "Valet Parking Services", icon: "🔑" },
    { name: "Exclusive Executive Lounges", icon: "🥂" },
  ];

  return (
    <div className="pt-24 pb-16 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Hero Banner */}
      <div className="relative text-center bg-gradient-to-r from-neutral-900 via-stone-850 to-slate-900 text-white py-20 px-6 rounded-2xl shadow-xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <span className="bg-primary/20 text-orange-400 border border-orange-500/30 px-4 py-1 text-xs tracking-wider uppercase rounded-full mb-4 font-medium">
            Elevated Living
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold leading-tight">
            Unforgettable Experiences
          </h1>
          <p className="text-white/80 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            From world-class dining to relaxing spa sessions, explore the curated luxury amenities designed to elevate your stay.
          </p>
        </div>
      </div>

      {/* Featured Experiences Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <Title
            title="Our Curated Stays"
            subTitle="Indulge in experiences that go far beyond standard lodging."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="overflow-hidden h-60 relative">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/95 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {exp.tagline}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-2xl font-semibold text-gray-800 mb-2">
                  {exp.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="bg-slate-50 border border-gray-100 p-8 md:p-12 rounded-2xl mb-20">
        <div className="text-center mb-10">
          <Title
            title="Exclusive Guest Privileges"
            subTitle="Enjoy these personalized services included during your stay with us."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 p-5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center gap-4"
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-gray-700 font-medium text-sm md:text-base">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-orange-400 to-amber-500 text-white p-12 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Luxury?
          </h2>
          <p className="text-white/95 text-sm md:text-base mb-8 max-w-lg leading-relaxed">
            Find the perfect destination and room matching your lifestyle. Book your escape now.
          </p>
          <button
            onClick={() => {
              navigate("/rooms");
              window.scrollTo(0, 0);
            }}
            className="px-8 py-3.5 bg-white text-orange-600 font-semibold rounded-full shadow-md hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
          >
            Browse Luxury Rooms
          </button>
        </div>
      </div>
    </div>
  );
};

export default Experience;
