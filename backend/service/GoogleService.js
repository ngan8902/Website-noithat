const { OAuth2Client } = require("google-auth-library");
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const User = require("../model/UserModel");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const uploadDir = path.join(__dirname, '../upload');

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
        
        if (user.avatar) {
            try {
                const imageUrl = await uploadGoogleAvatar(user.avatar);
                user.avatar = imageUrl; 
                await user.save(); 
            } catch (avatarError) {
                console.error("Lỗi tải và lưu avatar:", avatarError.message);
            }
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

async function uploadGoogleAvatar(googleAvatarUrl) {
    try {
        const response = await axios.get(googleAvatarUrl, { responseType: 'arraybuffer' });
        const fileExtension = response.headers['content-type'].split('/')[1];
        const filename = `${uuidv4()}.${fileExtension}`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));

        const baseUrl = process.env.BASE_URL || 'http://localhost:8000';


        return `${baseUrl}/upload/${filename}`;
    } catch (error) {
        // console.error('Lỗi tải và lưu ảnh:', error);
        throw new Error('Lỗi tải và lưu ảnh.');
    }
}


module.exports = {
    googleLogin,
    uploadGoogleAvatar
};
