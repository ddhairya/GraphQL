const jwt = require('jsonwebtoken')
module.exports = (req, res, next) =>{
    const authHandler = req.get('Authorization')
    if(!authHandler){
        req.isAuth = false
        return next()
    }
    const token = authHandler.split(" ")[1]
    if(!token || token === ''){
        req.isAuth = false
        return next()
    }
    let decodeToken
    try {
        decodeToken = jwt.verify(token,"mySecretKey")
    } catch (error) {
        req.isAuth = false
        return next()
    }
    if(!decodeToken){
        req.isAuth = false
        return next()
    }
    req.isAuth = true
    req.userID = decodeToken.userID
    return next()
}