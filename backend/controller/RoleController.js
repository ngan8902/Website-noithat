const RoleService = require('../service/RoleService')
const { ROLE } = require('../common/messages/user.message')
const { SIGN_UP_STATUS } = require('../common/constant/status.constant')



const createRole = async (req, res, next) => {
    try{
        const { role_id, accessApp, name, description } = req.body
        if (!role_id || !accessApp || !name || !description) {
            return res.status(200).json({
                status: SIGN_UP_STATUS.ERROR,
                message: ROLE.VALID_FIELDS_ERR
            })
        }
        const response = await RoleService.createRole(req.body)
        return res.status(200).json(response) 
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const editRole = async (req, res, next) => {
    // try{
    //     const role_id = req.params.id
    //     const data = req.body        
    //     if (!role_id) {
    //         return res.status(200).json({
    //             status: SIGN_UP_STATUS.ERROR,
    //             message: 'The roleID is required'
    //         })
    //     }
    //     const response = await RoleService.editRole(role_id, data)
    //     return res.status(200).json(response) 
    // }catch(e){
    //     return res.status(404).json({
    //         message: e
    //     })
    // }
}

module.exports = {
    createRole,
    editRole
}