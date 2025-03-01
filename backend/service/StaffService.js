const Staff = require("../model/StaffModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createStaff = (newStaff) => {
    return new Promise(async (resolve, reject) => {
        const { username, password, phone,  address, name, dob, gender, avatar, position, email, role_id, staffcode } = newStaff
        try{
            const checkStaff = await Staff.findOne({
                username: username
            })
            if (checkStaff !== null) {
                resolve({
                    status: 'ERROR',
                    message: 'username đã tồn tại!'
                })
            }
            const hash = bcrypt.hashSync(password, 10)

            const lastStaff = await Staff.findOne().sort({ createdAt: -1 });

            // Tạo productCode tự động
            let newCode = 'NV1';
            if (lastStaff && lastStaff.staffcode) {
                // Tách phần số khỏi productCode bằng RegEx
                const lastCodeNumber = parseInt(lastStaff.staffcode.match(/\d+/)) || 1000;
                newCode = `NV${lastCodeNumber + 1}`;
            }


            const createdStaff = await Staff.create({
                username, 
                password: hash, 
                phone,
                address,
                name,
                dob,
                gender,
                avatar,
                position,
                email,
                role_id,
                staffcode: newCode
            })
            if(createdStaff) {
                resolve({
                    status: 'SUCCESS',
                    message: 'Sign up success',
                    data: createdStaff
                }) 
            }
        }catch(e){
            reject(e)
        }
    })
}

const loginStaff = (staffLogin) => {
    return new Promise(async (resolve, reject) => {
        const { username, password} = staffLogin
        try{
            const checkStaff = await Staff.findOne({
                username: username
            })
            if (checkStaff === null) {
                resolve({
                    status: 'OK',
                    message: 'The staff is not defined'
                })
            }
            if(!password){
                resolve({
                    status: 'OK',
                    message: 'The password or user is incorrect'
                })
            }
            const access_token = await genneralAccessToken({
                id: checkStaff.id,
            })
            const refresh_token = await genneralRefreshToken({
                id: checkStaff.id,
            })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token: access_token,
                refresh_token: refresh_token
            }) 

        }catch(e){
            reject(e)
        }
    })
}

const updateStaff = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkStaff = await Staff.findOne({
                _id: id
            })
            if (checkStaff === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            
            if (data.currentPassword && data.newPassword) {
                const isMatch = await bcrypt.compare(data.currentPassword, checkUser.password);
                if (!isMatch) {
                    return resolve({
                        status: 'ERR',
                        message: 'Mật khẩu cũ không đúng'
                    });
                }

                const salt = await bcrypt.genSalt(10);
                data.password = await bcrypt.hash(data.newPassword, salt);

                delete data.currentPassword;
                delete data.newPassword;
            }

            const updatedStaff = await Staff.findByIdAndUpdate(id, data, {new: true})           
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedStaff
            }) 

        }catch(e){
            reject(e)
        }
    })
}

const deleteStaff = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkStaff = await Staff.findOne({
                _id: id
            })
            if (checkStaff === null) {
                resolve({
                    status: 'OK',
                    message: 'The staff is not defined'
                })
            }

            await Staff.findByIdAndDelete(id)           
            resolve({
                status: 'OK',
                message: 'Delete staff success',
            }) 

        }catch(e){
            reject(e)
        }
    })
}

const getAllStaff = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allStaff = await Staff.find()           
            resolve({
                status: 'OK',
                message: 'success',
                data: allStaff
            }) 
        }catch(e){
            reject(e)
        }
    })
}

const getDetailById = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const user = await Staff.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The staff is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'success',
                data: user
            }) 

        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createStaff,
    loginStaff,
    updateStaff,
    deleteStaff,
    getAllStaff,
    getDetailById
}