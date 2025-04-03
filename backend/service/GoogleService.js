const { OAuth2Client } = require("google-auth-library");
const User = require("../model/UserModel");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
}

async function googleLogin(req) {
    try {
        const { token } = req.body;
        if (!token) throw new Error("Thiếu token từ Google.");

        // Xác thực token từ Google
        const payload = await verifyGoogleToken(token);
        console.log("Payload từ Google:", payload);

        if (!payload.email) throw new Error("Không thể lấy email từ tài khoản Google.");

        // Kiểm tra xem user đã tồn tại trong DB chưa
        let user = await User.findOne({ email: payload.email });

        if (!user) {
            user = await User.create({
                name: payload.name,
                email: payload.email,
                googleId: payload.sub,
                avatar: payload.picture,
                phone: "",
                password: "",
                address: "",
            });
        }

        // Tạo JWT accessToken & refreshToken
        const accesstoken = genneralAccessToken({ id: user._id, email: user.email });
        const refreshToken = genneralRefreshToken({ id: user._id });

        return {
            success: true,
            message: "Đăng nhập thành công",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
            token: accesstoken,
            refreshToken,
        }
    } catch (error) {
        console.error("Lỗi Google Login:", error.message);
        throw new Error(error.message || "Lỗi không xác định khi đăng nhập bằng Google.");
    }
}

module.exports = {
    googleLogin,
};
