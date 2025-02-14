import React from "react";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/about/AboutSection";
import TeamMember from "../components/about/MemberSection";

const AboutPage = () => {
  return (
    <div>
      <HeroSection title="Giới Thiệu" background="/images/banner.png" />

      <AboutSection />

      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Đội Ngũ Của Chúng Tôi</h2>
          <div className="row">
            <TeamMember name="Đỗ Khánh Thành" role="CEO" image="/images/banner.png" />
            <TeamMember name="Nguyễn Thị Bích Ngân" role="Marketing" image="/images/logo.png" />
            <TeamMember name="Trần Thị Minh Khoa" role="Designer" image="/images/logo.png" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
