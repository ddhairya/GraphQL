const { UserModel } = require('./../../models')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


module.exports = {
    createUser: async( agrs, req) => {
        if(!req.isAuth){
            throw new Error(" Unauthenticated! ")
        }
        try {   
            const userExists = await UserModel.findOne({ email : agrs.userInput.email })
            if(userExists){
                throw new Error(" User Exists ")
            }
            const userPassword  = await bcryptjs.hash(agrs.userInput.password,12)
            const payload = {
                email: agrs.userInput.email,
                password: userPassword
            }
            const userCreate = await UserModel.create(payload) 
            const data = { ...userCreate._doc}
            return data
        } catch (error) {
            throw error
        }
    },
    login : async( { email, password}) => {
        try {
            const userExists = await UserModel.findOne({email})
            if(!userExists){
                throw new Error("User doesn't exists")
            }
            const passwordMatch = await bcryptjs.compare( password, userExists.password)
            if(!passwordMatch){
                throw new Error("Password mismatch")
            }
            const token = jwt.sign({ userID : userExists._id, email : userExists.email}, "mySecretKey", {
                expiresIn : "1h"
            })
            return({ userID : userExists._id, token, token_expiry : 1})

        } catch (error) {
            throw error
        }
    }
}