import React from "react";

const PolicyTerms = () => {
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5">
          Chính Sách Bảo Mật và Điều Khoản Sử Dụng
        </h2>
        <div className="row">
          <div className="col-md-12">
            {/* Chính Sách Bảo Mật */}
            <h3 className="fw-bold mb-3">Chính Sách Bảo Mật</h3>
            <p className="text-muted mb-4">
              Chúng tôi cam kết bảo vệ sự riêng tư của bạn. Chính sách bảo mật
              này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
            </p>
            <h5 className="fw-bold mb-3">1. Thu Thập Thông Tin</h5>
            <p className="text-muted mb-4">
              Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài
              khoản, mua hàng hoặc liên hệ với chúng tôi. Thông tin này bao gồm
              tên, địa chỉ email, số điện thoại và địa chỉ giao hàng.
            </p>
            <h5 className="fw-bold mb-3">2. Sử Dụng Thông Tin</h5>
            <p className="text-muted mb-4">
              Chúng tôi sử dụng thông tin cá nhân của bạn để xử lý đơn hàng, cung
              cấp dịch vụ khách hàng và gửi thông tin khuyến mãi. Chúng tôi không
              chia sẻ thông tin cá nhân của bạn với bên thứ ba trừ khi cần thiết
              để hoàn thành đơn hàng của bạn.
            </p>
            <h5 className="fw-bold mb-3">3. Bảo Vệ Thông Tin</h5>
            <p className="text-muted mb-4">
              Chúng tôi sử dụng các biện pháp bảo mật để bảo vệ thông tin cá nhân
              của bạn khỏi truy cập trái phép, sử dụng hoặc tiết lộ. Tuy nhiên,
              không có phương thức truyền tải dữ liệu nào qua Internet hoặc phương
              thức lưu trữ điện tử nào là hoàn toàn an toàn.
            </p>

            {/* Điều Khoản Sử Dụng */}
            <h3 className="fw-bold mb-3">Điều Khoản Sử Dụng</h3>
            <p className="text-muted mb-4">
              Bằng cách sử dụng trang web của chúng tôi, bạn đồng ý tuân thủ các
              điều khoản và điều kiện sau đây.
            </p>
            <h5 className="fw-bold mb-3">1. Sử Dụng Trang Web</h5>
            <p className="text-muted mb-4">
              Bạn đồng ý sử dụng trang web của chúng tôi chỉ cho các mục đích hợp
              pháp và không vi phạm quyền của bất kỳ bên thứ ba nào. Bạn không
              được sử dụng trang web của chúng tôi để truyền tải bất kỳ tài liệu
              nào có tính chất bất hợp pháp, đe dọa, lạm dụng hoặc xâm phạm quyền
              riêng tư của người khác.
            </p>
            <h5 className="fw-bold mb-3">2. Quyền Sở Hữu Trí Tuệ</h5>
            <p className="text-muted mb-4">
              Tất cả nội dung trên trang web của chúng tôi, bao gồm văn bản, hình
              ảnh, đồ họa và logo, đều thuộc sở hữu của chúng tôi hoặc các nhà
              cung cấp của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ. Bạn
              không được sao chép, phân phối hoặc sử dụng bất kỳ nội dung nào mà
              không có sự cho phép bằng văn bản của chúng tôi.
            </p>
            <h5 className="fw-bold mb-3">3. Thay Đổi Điều Khoản</h5>
            <p className="text-muted mb-4">
              Chúng tôi có quyền thay đổi các điều khoản và điều kiện này bất kỳ
              lúc nào mà không cần thông báo trước. Việc tiếp tục sử dụng trang
              web của bạn sau khi có các thay đổi này đồng nghĩa với việc bạn
              chấp nhận các điều khoản và điều kiện đã được sửa đổi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PolicyTerms;