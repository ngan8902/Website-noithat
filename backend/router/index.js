const UserRouter = require('./UserRouter')

const routers = (app) => {
    app.use('/api/user', UserRouter)
}

module.exports = routers;