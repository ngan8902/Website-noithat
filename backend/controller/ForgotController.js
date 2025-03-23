const User = require("../model/UserModel");
const { sendEmail } = require("../common/utils/email");
const crypto = require("crypto");
const bcrypt = require("bcrypt")

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: "ERR", message: "Email không tồn tại!" });

    // Tạo mã OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresIn = 5 * 60 * 1000;
    user.resetPasswordOTP = otp;
    user.otpExpires = Date.now() + expiresIn;
    await user.save();;

    const emailContent = `
      Xin chào,
      Mã OTP đặt lại mật khẩu của bạn là: ${otp}
      OTP này có hiệu lực trong 5 phút. Vui lòng không chia sẻ với ai khác.
      Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
      Trân trọng,
      Furniture
    `;

    // Gửi email
    await sendEmail(email, "Mã OTP Đặt Lại Mật Khẩu", emailContent);

    return res.json({ status: "OK", message: "Mã OTP đã được gửi!" });
  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    return res.status(500).json({ status: "ERR", message: "Lỗi hệ thống!" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    // Kiểm tra mã OTP
    if (user.resetPasswordOTP !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ status: "ERR", message: "Mã OTP không hợp lệ hoặc đã hết hạn!" });
    }

    // Xác minh thành công, có thể chuyển user sang bước đặt lại mật khẩu
    return res.json({ status: "OK", message: "Xác minh OTP thành công!" });
  } catch (error) {
    console.error("Lỗi xác minh OTP:", error);
    return res.status(500).json({ status: "ERR", message: "Lỗi hệ thống!" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  console.log("Email: ", email)
  console.log("newPass: ", newPassword)

  try {
    const user = await User.findOne({ email });

    // Cập nhật mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.otpExpires = null;
    await user.save();

    return res.json({ status: "OK", message: "Mật khẩu đã được cập nhật!" });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    return res.status(500).json({ status: "ERR", message: "Lỗi hệ thống!" });
  }
};