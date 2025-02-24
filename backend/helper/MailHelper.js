require('dotenv').config();
const nodemailer = require('nodemailer');


const sendMail = async (req, res) => {
    try {
        // Tạo transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }

        });
        const { name, email, message } = req.body;

        // Cấu hình nội dung email
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_USER,
            subject: `Tin nhắn từ ${name}`,
            text: message,
            html: `
                <h3>Thông tin liên hệ:</h3>
                <ul>
                    <li><b>Họ tên:</b> ${name}</li>
                    <li><b>Email:</b> ${email}</li>
                </ul>
                <h3>Nội dung tin nhắn:</h3>
                <p>${message}</p>
            `
        };

        //Gửi email
        const info = await transporter.sendMail(mailOptions);
        // console.log("Email đã gửi:", info.response);
        return res.status(200).json(info.response)

    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
        return { success: false, message: "Lỗi khi gửi email. Vui lòng thử lại sau." };
    }

}


module.exports = {
    sendMail
}





