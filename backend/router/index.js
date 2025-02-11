const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')

const routers = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)

}

module.exports = routers;