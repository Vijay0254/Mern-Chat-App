const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

//For User
const verifyToken = (req, res, next) =>{
    const token = req?.cookies?.token

    if(token){
        jwt.verify(token, process.env.JWT_SECRET_KEY, async(err, decoded) =>{
            try{
                if(err){
                    return res.status(200).json({message: "Token not Valid", success: false, error: "Invalid Credentials"})
                }
                else{
                    const user = await UserModel.findById({_id: decoded.id}).select("-password")
                    req.user = user
                    next()
                }
            }
            catch(err){
                console.log(`Error in User Verify Token - ${err}`)
                return res.status(200).json({message: 'Internal Server Error'})
            }
        })
    }
    else{
        return res.status(200).json({message: "Token Timed Out", success: false, error: "Invalid Credentials"})
    }
}

module.exports = verifyToken