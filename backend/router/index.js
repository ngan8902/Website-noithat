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
const CommentsRoute = require('./CommentsRoute')
const DashboardRoute = require('./DashBoardRoute')
const AttendanceRoute = require('./AttendanceRoute')
const Send = require('./EmailRoute')
const HealthCheck = require('./HealthCheckRoute')

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
    app.use("/api/comments", CommentsRoute);
    app.use("/api/dashboard", DashboardRoute);
    app.use("/api/attendance", AttendanceRoute)
    app.use('/api/send', Send)
    app.use('/api/health-check', HealthCheck)
}

module.exports = routers;