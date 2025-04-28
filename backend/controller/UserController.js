const UserService = require('../service/UserService')
const JwtService = require('../service/JwtService')
const { SIGN_UP } = require('../common/messages/user.message')
const { SIGN_UP_STATUS } = require('../common/constant/status.constant')

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})*$/
        const isCheckEmail = reg.test(email)
        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({
                status: SIGN_UP_STATUS.ERROR,
                message: SIGN_UP.VALID_FIELDS_ERR
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập email'
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mật khẩu và mật khẩu xác nhận không trùng khớp!'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Nhập các trường bắt buộc!'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập email!'
            })
        }

        const response = await UserService.loginUser(req.body)

        if (response.status === 'OK' && response.access_token) {
            res.cookie('token', response.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
            });
        }

        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;

        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required',
            });
        }

        if (req.file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ message: 'Loại file không được hỗ trợ.' });
            }
            data.avatar = `/upload/${req.file.filename}`;
        }

        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: "ERR",
                message: "Thiếu thông tin tài khoản",
            });
        }

        const response = await UserService.updatePassword(userId, {
            currentPassword,
            newPassword,
            confirmPassword,
        });

        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: e.message || "Lỗi server",
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)

        if (response.status === 'OK' && response.access_token) {
            res.cookie('token', response.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
            });
        }

        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const getMe = async (req, res) => {
    try {
        const { id } = req['payload'];
        const user = await UserService.getDetailsUser(id);
        return res.status(200).json({
            status: SIGN_UP_STATUS.SUCCESS,
            message: 'Get User Success!',
            data: user.data
        })
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const logoutUser = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None', 
        });

        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Đăng xuất thành công',
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi khi đăng xuất',
        });
    }
};


module.exports = {
    createUser,
    loginUser,
    updateUser,
    updatePassword,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    getMe,
    logoutUser
}