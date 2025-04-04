const authService = require("../service/GoogleService");

module.exports = {
    googleLogin: async (req, res) => {
        try {
            const data = await authService.googleLogin(req);

            if (!data || !data.token) {
                return res.status(400).json({ message: "Lỗi xác thực Google", status: "ERR" });
            }

            if (data.user && data.user.avatar) {
                try {
                    const imageUrl = await authService.uploadGoogleAvatar(data.user.avatar);
                    data.user.avatar = imageUrl; 
                } catch (avatarError) {
                    console.error("Lỗi tải và lưu avatar:", avatarError.message);
                }
            }

            res.cookie("token", data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "None",
                path: "/",
            });

            // Lưu refreshToken vào cookie (nếu cần sử dụng cho refresh sau này)
            res.cookie("refreshToken", data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Bật secure nếu đang chạy production
                sameSite: "None",
            });

            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công",
                user: data.user,
                token: data.token,
            });
        } catch (error) {
            console.error("Lỗi tại GoogleController:", error.message);

            // Đảm bảo chỉ gửi response nếu chưa gửi trước đó
            if (!res.headersSent) {
                return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
            }
        }
    },

    uploadGoogleAvatar: async (req, res) => {
        const googleAvatarUrl = req.body.url;

        if (!googleAvatarUrl) {
            return res.status(400).json({ message: 'URL ảnh không được cung cấp.' });
        }

        try {
            const imageUrl = await authService.uploadGoogleAvatar(googleAvatarUrl);
            res.json({ imageUrl });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
