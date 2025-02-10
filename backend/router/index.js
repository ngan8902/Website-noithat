const routers = (app) => {
    app.get('/user', (req, res) => {
        res.send('User page')
    })
}

module.exports = routers;