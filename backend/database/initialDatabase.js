const { connection } = require('./mysql') // Destructuring
const UserModel = require('../model/user.repo')


connection(async () => {
    try {
        // await RoleModel.initTableToDB()
        // await UserModel.initTableToDB() // promise
        console.log('All tables created success:::::')
    } catch(err) {
        console.log(err)
    }
    // Chạy xong thoát chương trình
    process.exit()
})