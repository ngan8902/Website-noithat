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
              <strong>KLTN 2024 - 2025</strong> Sự phát triển mạnh mẽ của khoa học và công nghệ, đặc biệt trong thời đại công nghiệp 4.0, đã tạo ra nhiều cơ hội mới cho doanh nghiệp trong việc nâng cao hiệu quả quản lý. Trong đó, quản lý nhân sự là một lĩnh vực quan trọng, tuy nhiên các phương pháp truyền thống còn nhiều hạn chế như gian lận, mất thẻ hay chi phí cao. Việc ứng dụng công nghệ nhận diện khuôn mặt được xem là giải pháp tối ưu, giúp đảm bảo tính chính xác, minh bạch và hiệu quả.
            </p>
            <p className="text-muted mb-4">
              Từ nhận thức đó, em chọn đề tài <strong>"Tích hợp công nghệ nhận diện khuôn mặt trong quản lý nhân sự cho công ty nội thất"</strong>" nhằm xây dựng một hệ thống quản lý nhân sự tự động kết hợp với nền tảng bán hàng trực tuyến. Mục tiêu là hỗ trợ quá trình hiện đại hóa, chuyển đổi số doanh nghiệp, tiết kiệm chi phí, cải thiện môi trường làm việc và góp phần phát triển bền vững.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
