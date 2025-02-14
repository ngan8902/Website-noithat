import React from "react";
import HeroSection from "../components/HeroSection";
import ContactForm from "../components/contact/ContactForm";

const Contact = () => {
  return (
    <div>
      <HeroSection title="Liên Hệ" background="/images/banner.png" />

      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Liên Hệ Với Chúng Tôi</h2>
          <div className="row">
            <div className="col-md-6 mb-4">
              <img
                src="/images/logo.png"
                alt="Thông tin liên hệ"
                className="img-fluid rounded shadow mb-4"
              />
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;