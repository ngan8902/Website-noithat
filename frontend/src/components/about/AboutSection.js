import React from "react";

const AboutSection = () => {
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5">Về Chúng Tôi</h2>
        <div className="row align-items-center mb-5">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              alt="Giới thiệu về chúng tôi"
              className="img-fluid rounded shadow"
              src=""
            />
          </div>
          <div className="col-md-6">
            <p className="text-muted mb-4">
              <strong>FNT</strong> là một thương hiệu hàng đầu trong lĩnh vực cung cấp các sản phẩm nội thất cao cấp. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng nhất, với thiết kế tinh tế và sang trọng.
            </p>
            <p className="text-muted mb-4">
              Với đội ngũ thiết kế chuyên nghiệp và tận tâm, chúng tôi luôn nỗ lực để tạo ra những sản phẩm không chỉ đẹp mắt mà còn tiện dụng và bền bỉ. Chúng tôi tin rằng, mỗi sản phẩm của chúng tôi sẽ góp phần nâng tầm không gian sống của bạn.
            </p>
            <p className="text-muted mb-4">
              Chúng tôi luôn đặt khách hàng lên hàng đầu và cam kết mang đến dịch vụ tốt nhất. Hãy đến với Nội Thất Sang Trọng để trải nghiệm sự khác biệt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
