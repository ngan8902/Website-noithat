import React from "react";

const About = () => {
  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="/images/introduce.png"
              className="img-fluid rounded shadow"
              alt="Giới thiệu về chúng tôi"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-4">Giới Thiệu</h2>
            <p className="text-muted mb-4">
              Khóa luận tốt nghiệp HKII 2024 - 2025.
            </p>
            <button className="btn btn-border btn-dark" onClick={() => window.location.href='/about'}>Tiềm Hiểu Thêm</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;