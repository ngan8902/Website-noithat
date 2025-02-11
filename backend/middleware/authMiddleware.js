//Phân quyền Admin
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const authMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    console.log('Token:', token)
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if(err) {
            console.error('JWT Verify Error:', err);
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERR'
            })   
        }
        const { payload } = user
        if (payload?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERR'
            })  
        }
        console.log('user', user)
    });
}

const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if(err) {
            console.error('JWT Verify Error:', err);
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERR'
            })   
        }
        const { payload } = user
        if (payload?.isAdmin || payload?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERR'
            })  
        }
        console.log('user', user)
    });
}


module.exports = {
    authMiddleware,
    authUserMiddleware
} 