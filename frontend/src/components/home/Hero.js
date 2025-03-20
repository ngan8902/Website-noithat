import React, { useEffect, useState } from "react";

const Hero = () => {
  const images = [
    "/images/banner.png", 
    "/images/banner2.png"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="hero d-flex align-items-center justify-content-center text-white text-center"
      style={{ backgroundImage: `url(${images[currentIndex]})`, backgroundSize: "cover", backgroundPosition: "center", height: "75vh", transition: "background-image 1s ease-in-out" }}>
      <div className="container mx-auto h-full flex items-center justify-center text-center text-white">
        <div>
          <h2 className="display-4 fw-bold mb-4">Nâng Tầm Không Gian Sống</h2>
          <p className="lead mb-4">Với những sản phẩm nội thất đẳng cấp và sang trọng</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;