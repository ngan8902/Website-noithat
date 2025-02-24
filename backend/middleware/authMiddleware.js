//Phân quyền Admin
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { TOKEN_KEY, STAFF_TOKEN_KEY } = require('../common/constant/authen.constan')

dotenv.config()

const authMiddleware = (req, res, next) => {
    const token = req.headers.token
    console.log('Token:', token)
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if(err) {
            console.error('JWT Verify Error:', err);
            return res.status(500).json({
                message: 'The authentication',
                status: 'ERR'
            })   
        }
        const { payload } = user
        if (payload) {
            next()
        } else {
            return res.status(500).json({
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
            return res.status(500).json({
                message: 'The authentication',
                status: 'ERR'
            })   
        }
        const { payload } = user
        if (payload?.isAdmin || payload?.id === userId) {
            next()
        } else {
            return res.status(500).json({
                message: 'The authentication',
                status: 'ERR'
            })  
        }
        console.log('user', user)
    });
}

const authenticateUser = (req, res, next) => {
    const token = req.headers[TOKEN_KEY]
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, jwtObj) {
        if(err) {
            console.error('JWT Verify Error:', err);
            return res.json({
                message: 'The authentication',
                status: 'ERR'
            })   
        }
        const { payload } = jwtObj
        if (payload) {
            req['payload'] = payload;
            next()
        } else {
            return res.json({
                message: 'The authentication',
                status: 'ERR'
            })  
        }
    });
}

const authenticateStaff = (req, res, next) => {
    const token = req.headers[STAFF_TOKEN_KEY]
    if (!token) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERR'
        });
    }

    if (token.split('.').length !== 3) {
        return res.status(401).json({
            message: 'Invalid token format',
            status: 'ERR'
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, jwtObj) {
        if(err) {
            console.error('JWT Verify Error:', err);
            return res.json({
                message: 'The authentication',
                status: 'ERR'
            })   
        }
        const { payload } = jwtObj
        if (payload || payload?.role_id === 1) {
            req['payload'] = payload;
            next()
        } else {
            return res.json({
                message: 'The authentication',
                status: 'ERR'
            })  
        }
    });
}


module.exports = {
    authMiddleware,
    authUserMiddleware,
    authenticateUser,
    authenticateStaff
} 