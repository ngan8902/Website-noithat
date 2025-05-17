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
              src="/images/introduce.png"
            />
          </div>
          <div className="col-md-6">
            <p className="text-muted mb-4">
              <strong>KLTN 2024 - 2025</strong> Sự bùng nổ của công nghệ trong thời đại công nghiệp 4.0 đã mở ra nhiều hướng đi mới cho doanh nghiệp, đặc biệt là trong lĩnh vực thương mại điện tử và quản lý nội bộ. Với nhu cầu ngày càng cao trong việc tối ưu hóa quy trình bán hàng và nâng cao hiệu quả quản lý nhân sự, việc tích hợp các công nghệ hiện đại vào hệ thống quản lý doanh nghiệp là xu hướng tất yếu.
            </p>
            <p className="text-muted mb-4">
              Từ nhận thức đó, em chọn đề tài <strong>"Xây dựng website thương mại điện tử tích hợp chấm công bằng nhận diện khuôn mặt cho doanh nghiệp kinh doanh nội thất"</strong> Đề tài không chỉ hướng đến việc xây dựng một nền tảng bán hàng trực tuyến chuyên nghiệp, hỗ trợ doanh nghiệp tiếp cận khách hàng hiệu quả hơn, mà còn kết hợp giải pháp chấm công hiện đại bằng công nghệ nhận diện khuôn mặt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
