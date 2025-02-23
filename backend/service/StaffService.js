const Staff = require("../model/StaffModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createStaff = (newStaff) => {
    return new Promise(async (resolve, reject) => {
        const { username, password, phone,  address, name, dob, avatar, email } = newStaff
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
            const createdStaff = await Staff.create({
                username, 
                password: hash, 
                phone,
                address,
                name,
                dob,
                avatar,
                email
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
    getDetailById
}