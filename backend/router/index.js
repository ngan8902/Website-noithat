const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const RoleRouter = require('./RoleRouter')
const StaffRouter = require('./StaffRouter')
const MailRouter = require('./MailRouter')
const OrderRouter = require('./OrderRouter')
const ChatRouter = require('./ChatRouter')
const ReciverInfoRouter = require('./ReciverInfoRouter')
const CartRoute = require('./CartRoute')
const GoogleRoute = require('./GoogleRoute')
const ForgotRoute = require('./ForgotRoute') 
const ImagesRoute = require('./ImagesRoute') 
const MomoRoute = require('./MomoRoute')
const PayosRoute = require('./PayosRoute')

const routers = (app) => {
    app.use('/api/staff', StaffRouter)
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/role', RoleRouter)
    app.use('/api/email', MailRouter)
    app.use('/api/chat', ChatRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/address', ReciverInfoRouter)
    app.use('/api/cart', CartRoute)
    app.use('/api/auth', GoogleRoute)
    app.use('/api/auth', ForgotRoute)
    app.use("/api/upload", ImagesRoute);
    app.use("/api/momo", MomoRoute);
    app.use("/api/payos", PayosRoute);
}

module.exports = routers;