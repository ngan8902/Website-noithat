const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const RoleRouter = require('./RoleRouter')
const StaffRouter = require('./StaffRouter')


const routers = (app) => {
    app.use('/api/staff', StaffRouter)
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/role', RoleRouter)


}

module.exports = routers;