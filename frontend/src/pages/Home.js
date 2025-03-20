import React from "react";
import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";
import About from "../components/home/About";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <About />
    </div>
  );
};

export default Home;
