import React, { useEffect } from "react";
import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";
import About from "../components/home/About";

const Home = () => {
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("hasReloaded");
    }
  }, []);

  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <About />
    </div>
  );
};

export default Home;
