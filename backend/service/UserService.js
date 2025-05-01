const User = require("../model/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser
        try {
            const checkPhone = await User.findOne({
                phone: phone
            })
            if (checkPhone !== null) {
                resolve({
                    status: 'ERROR',
                    message: 'Số điện thoại đã tồn tại!'
                })
            }
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERROR',
                    message: 'Email đã tồn tại!'
                })
            }
            
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone,
                googleId: null
            })
            if (createdUser) {
                resolve({
                    status: 'SUCCESS',
                    message: 'Sign up success',
                    data: createdUser
                })
            }
        } catch (e) {
            console.error('Error creating user:', e)
            reject({
                status: 'ERROR',
                message: 'Đã xảy ra lỗi khi tạo người dùng.'
            })
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            console.log("checkUser", checkUser)
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 'OK',
                    message: 'The password or user is incorrect'
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token: access_token,
                refresh_token: refresh_token
            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id,
            });

            if (checkUser === null) {
                return resolve({
                    status: 'OK',
                    message: 'The user is not defined',
                });
            }

            const { email, phone } = newUser

            const checkUserPhone = await User.findOne({
                phone: phone,
            });

            if (checkUserPhone !== null) {
                resolve({
                    status: 'ERROR',
                    message: 'Số điện thoại đã tồn tại!'
                })
            }

            const checkUserEmail = await User.findOne({
                email: email,
            });

            if (checkUserEmail !== null) {
                resolve({
                    status: 'ERROR',
                    message: 'Email đã tồn tại!'
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

            if (!updatedUser) {
                return resolve({
                    status: 'ERR',
                    message: 'Cập nhật thông tin thất bại, vui lòng thử lại!',
                });
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser,
            });
        } catch (e) {
            reject(e);
        }
    })
};

const updatePassword = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findById(id);

            if (!checkUser) {
                return resolve({
                    status: "ERR",
                    message: "Người dùng không tồn tại",
                });
            }

            // Tài khoản chưa có mật khẩu
            if (!checkUser.password) {
                if (!data.newPassword || !data.confirmPassword) {
                    return resolve({
                        status: "ERR",
                        message: "Vui lòng nhập mật khẩu mới và xác nhận mật khẩu!",
                    });
                }

                if (data.newPassword !== data.confirmPassword) {
                    return resolve({
                        status: "ERR",
                        message: "Mật khẩu xác nhận không khớp!",
                    });
                }
            } else {
                if (!data.currentPassword || !data.newPassword) {
                    return resolve({
                        status: "ERR",
                        message: "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới!",
                    });
                }

                const isMatch = await bcrypt.compare(data.currentPassword, checkUser.password);
                if (!isMatch) {
                    return resolve({
                        status: "ERR",
                        message: "Mật khẩu cũ không đúng",
                    });
                }
            }

            // Mã hóa mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(data.newPassword, salt);

            // Cập nhật mật khẩu mới
            await User.findByIdAndUpdate(id, { password: hashedPassword });

            resolve({
                status: "OK",
                message: "Đổi mật khẩu thành công",
            });

        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'success',
                data: user
            })

        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    updatePassword,
    deleteUser,
    getAllUser,
    getDetailsUser
}