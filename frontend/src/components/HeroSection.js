import React from "react";

const HeroSection = ({ title, background }) => {
  return (
    <section
      className="hero d-flex align-items-center justify-content-center text-white"
      style={{
        backgroundImage: `url(${background})`,
        height: "50vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center">
        <h2 className="display-4 fw-bold mb-4">{title}</h2>
      </div>
    </section>
  );
};

export default HeroSection;
