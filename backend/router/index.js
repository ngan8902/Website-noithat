const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const RoleRouter = require('./RoleRouter')
const StaffRouter = require('./StaffRouter')
const MailRouter = require('./MailRouter')


const routers = (app) => {
    app.use('/api/staff', StaffRouter)
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/role', RoleRouter)
    app.use('/api/email', MailRouter)


}

module.exports = routers;