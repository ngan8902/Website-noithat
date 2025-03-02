const StaffService = require('../service/StaffService')
const JwtService = require('../service/JwtService') 
const { SIGN_UP } = require('../common/messages/user.message')
const { SIGN_UP_STATUS } = require('../common/constant/status.constant')

const createStaff = async (req, res) => {
    try{
        const { username, password, phone,  address, name, dob, gender, avatar, position, email, role_id, staffcode } = req.body
        const isCheckUsername = username
        if (!username || !password || !phone || !address || !name || !dob || !gender || !avatar || !position || !email){
            return res.status(200).json({
                status: SIGN_UP_STATUS.ERROR,
                message: SIGN_UP.VALID_FIELDS_ERR
            })
        }else if (!isCheckUsername){
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập username'
            })
        }
        const response = await StaffService.createStaff(req.body)
        return res.status(200).json(response) 
    }catch(e){
        console.log(e)
        return res.status(500).json({
            message: e
        })
    }
}

const loginStaff = async (req, res) => {
    try{
        const { username, password } = req.body
        const isCheckUsername = username
        if ( !username || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Nhập các trường bắt buộc!'
            })
        }else if (!isCheckUsername){
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập email!'
            })
        }
       
        const response = await StaffService.loginStaff(req.body)
        return res.status(200).json(response) 
    }catch(e){
        console.log(e)
        return res.status(500).json({
            message: e
        })
    }
}

const updateStaff = async (req, res) => {
    try{
        const staffId = req.params.id
        const data = req.body
        if(!staffId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The staffId is required'
            })
        }
        const response = await StaffService.updateStaff(staffId, data)
        return res.status(200).json(response) 
    }catch(e){
        console.log(e)
        return res.status(500).json({
            message: e
        })
    }
}

const deleteStaff = async (req, res) => {
    try{
        const staffId = req.params.id
        if(!staffId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The staffId is required'
            })
        }
        const response = await StaffService.deleteStaff(staffId)
        return res.status(200).json(response) 
    }catch(e){
        return res.status(500).json({
            message: e
        })
    }
}

const getAllStaff = async (req, res) => {
    try{
        const response = await StaffService.getAllStaff()
        return res.status(200).json(response) 
    }catch(e){
        return res.status(500).json({
            message: e
        })
    }
}

const getMe = async (req, res) => {
    try {
        const { id } = req['payload'];
        const user = await StaffService.getDetailById(id);
        return res.status(200).json({
            status: SIGN_UP_STATUS.SUCCESS,
            message: 'Get User Success!',
            data: user.data
        })
    } catch(e) {
        return res.status(500).json({
            message: e
        })
    }
}



module.exports = {
    createStaff,
    loginStaff,
    updateStaff,
    deleteStaff,
    getAllStaff,
    getMe
}