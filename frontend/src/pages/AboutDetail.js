import React from "react";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/about/AboutSection";
import TeamMember from "../components/about/MemberSection";

const AboutPage = () => {
  return (
    <div>
      <HeroSection title="Giới Thiệu" background="/images/banner3.png" />

      <AboutSection />

      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Đội Ngũ Của Chúng Tôi</h2>
          <div className="row justify-content-center">
            <TeamMember name="Đỗ Khánh Thành" role="21033521" image="/images/khanhthanh.jpg" />
            <TeamMember name="Nguyễn Thị Bích Ngân" role="20059801" image="/images/bichngan.jpg" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
