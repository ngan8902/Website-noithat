const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const genneralAccessToken = (payload) => {
    const access_token = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '1d'})

    return access_token
}

const genneralRefreshToken = (payload) => {
    const refresh_token = jwt.sign({
        payload
    }, process.env.REFREHS_TOKEN, { expiresIn: '2d'})

    return refresh_token
}

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try{
            jwt.verify(token, process.env.REFREHS_TOKEN, async (err, user) => {
                if(err) {
                    resolve({
                        status: 'ERR',
                        message: 'The authentication'
                    })
                }
                const {payload} = user
                const access_token = await genneralAccessToken({
                    id: payload.id,
                    isAdmin: payload?.isAdmin
                })
                console.log(access_token)
                resolve({
                    status: 'OK',
                    message: 'success',
                    access_token
                }) 
            })
            
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}