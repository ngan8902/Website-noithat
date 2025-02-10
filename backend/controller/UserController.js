const UserService = require('../service/UserService') 

const createUser = (req, res) => {
    try{
        console.log(req.body)
        await UserService.createUser()
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser
}