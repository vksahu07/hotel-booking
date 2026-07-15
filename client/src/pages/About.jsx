import React from "react";
import Title from "../components/Title";

const About = () => {
  const stats = [
    { value: "500+", label: "Partner Hotels" },
    { value: "10k+", label: "Happy Guests" },
    { value: "4.8/5", label: "Average Rating" },
    { value: "15+", label: "Destinations" },
  ];

  const values = [
    {
      title: "Excellence",
      description: "We handpick only the finest luxury accommodations to ensure your comfort is never compromised.",
      icon: "✨",
    },
    {
      title: "Trust & Safety",
      description: "With verified listings, secured payment methods, and 24/7 support, your safety is our priority.",
      icon: "🛡️",
    },
    {
      title: "Seamless Experience",
      description: "From instant browsing to easy check-ins, we make booking hotels a completely hassle-free process.",
      icon: "⚡",
    },
  ];

  return (
    <div className="pt-24 pb-16 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Hero Section */}
      <div className="relative text-center bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-20 px-6 rounded-2xl shadow-xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-black/35"></div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <span className="bg-primary/20 text-orange-400 border border-orange-500/30 px-4 py-1 text-xs tracking-wider uppercase rounded-full mb-4 font-medium">
            Redefining Travel
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold leading-tight">
            About QuickStay
          </h1>
          <p className="text-white/80 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Discover the stories and values that make us the preferred choice for premium accommodations worldwide.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <Title
            align="left"
            title="Our Story"
            subTitle="How we transformed hotel bookings into a premium luxury experience."
          />
          <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
            <p>
              Founded with the vision to bridge the gap between discerning travelers and premium stays, <strong>QuickStay</strong> curated a portfolio of properties that stand out for their location, comfort, and character.
            </p>
            <p>
              We believe a trip is only as good as the destination you rest your head in. That's why our dedicated team inspects every room and verifies every detail before it goes live on our platform, ensuring you get exactly what you see.
            </p>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800"
            alt="Hotel Interior"
            className="rounded-2xl shadow-2xl object-cover w-full h-[400px]"
          />
          <div className="absolute -bottom-6 -left-6 bg-white shadow-xl p-6 rounded-2xl hidden md:flex items-center gap-4 border border-gray-100">
            <span className="text-4xl">🌟</span>
            <div>
              <p className="font-playfair text-xl font-bold text-gray-800">4.8/5 Star Rating</p>
              <p className="text-gray-500 text-sm">Rated by thousands of travelers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-50 border border-gray-100 py-12 px-8 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-20 shadow-sm">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-primary font-bold text-4xl md:text-5xl font-playfair mb-1 text-orange-500">
              {stat.value}
            </span>
            <span className="text-gray-500 text-sm md:text-base font-light">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Core Values Section */}
      <div className="text-center mb-10">
        <Title
          title="Our Core Values"
          subTitle="The principles that guide our service and help us deliver exceptional hospitality."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {values.map((val, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200/80 p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl block mb-6">{val.icon}</span>
                <h3 className="font-playfair text-2xl font-semibold text-gray-800 mb-3">
                  {val.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {val.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
