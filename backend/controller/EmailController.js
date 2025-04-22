const nodemailer = require("nodemailer");
const Order = require("../model/OrderModel");
const User = require("../model/UserModel");

exports.sendReviewReminder = async (req, res) => {
  const { orderCode } = req.body;

  try {
    const order = await Order.findOne({ orderCode }).populate("user");

    console.log("order", order);

    if (!order || order.status !== "delivered" || order.rating > 0 || order.isReminderSent || !order.user?.email) {
      return res.status(400).json({ message: "Không hợp lệ để gửi nhắc đánh giá." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Furniture" <${process.env.EMAIL_USER}>`,
      to: order.user?.email,
      subject: `Đánh giá đơn hàng từ Furniture`,
      html: `
        <p>Chào ${order.user?.name},</p>
        <p>Bạn đã nhận đơn hàng với mã <strong>${orderCode}</strong>. Bạn cảm thấy sản phẩm thế nào?</p>
        <p>Bỏ qua email này nếu như bạn đã Đánh giá sản phẩm rồi!</p>
        <p>Nếu chưa đánh giá! Vui lòng truy cập vào trang lịch sử mua hàng để đánh giá sản phẩm giúp chúng tôi phục vụ bạn tốt hơn!</p>
        <a href="https://furniture.com/account" style="background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Đánh giá ngay</a>
        <p>Trân trọng, <br/>Furniture</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    order.isReminderSent = true;
    await order.save();

    res.status(200).json({ message: "Gửi email thành công." });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

exports.shipOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user");

    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // Kiểm tra khu vực giao hàng
    const isInSouthernRegion = order.user?.address &&
      (order.user.address.includes("Hồ Chí Minh") ||
       order.user.address.includes("Bình Dương") ||
       order.user.address.includes("Đồng Nai") ||
       order.user.address.includes("Vũng Tàu") ||
       order.user.address.includes("Long An") ||
       order.user.address.includes("Tây Ninh"));

    // Tính ngày giao dự kiến
    let estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + (isInSouthernRegion ? 2 : 4));

    // Kiểm tra email người nhận
    const recipientEmail = order.user?.email;
    if (!recipientEmail) {
      return res.status(400).json({ message: "Không tìm thấy email người nhận" });
    }

    // Cấu hình gửi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const mailOptions = {
      from: `"Furniture" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: 'Thông báo giao hàng từ Furniture',
      html: `
        <html>
          <body>
            <h2>Thông báo giao hàng</h2>
            <p>Kính gửi <strong>${order.user?.name}</strong>,</p>
            <p>Đơn hàng của bạn (Mã đơn hàng: <strong>${order.orderCode}</strong>) đang được giao tới bạn.</p>
            <p><strong>Ngày giao dự kiến:</strong> ${estimatedDeliveryDate.toLocaleDateString("vi-VN")}</p>
            <p>Trân trọng!</p>
            <footer>
              <p><small>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!</small></p>
            </footer>
          </body>
        </html>
      `
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Lỗi khi gửi email:", error);
        return res.status(500).json({ message: "Lỗi khi gửi email" });
      }
      console.log("Email đã được gửi:", info.response);
      return res.status(200).json({ message: "Đơn hàng đang giao", order });
    });

  } catch (error) {
    console.error("Lỗi khi chuyển trạng thái giao hàng:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Lỗi server" });
    }
  }
};
