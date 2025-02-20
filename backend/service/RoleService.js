const Role = require('../model/RoleModel')

const createRole = (newRole) => {
    return new Promise(async (resolve, reject) => {
        const {role_id, accessApp, name, description  } = newRole
        try{ 
            const createdRole = await Role.create({
                name, 
                accessApp,
                description,
                role_id
            })
            if(createdRole) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdRole
                }) 
            }
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createRole
}