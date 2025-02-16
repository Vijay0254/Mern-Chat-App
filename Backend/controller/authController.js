import UserModel from "../models/UserModel"
import bcrypt from'bcrypt'
import jwtToken from'../utils/jwtToken'
import cloudinary from'cloudinary'
import validator from'validator'

export const signupController = async(req, res) =>{
    try{
        const { email, fullName, password } = req.body

        if(!email || !password || !fullName){
            return res.status(200).json({message: "Please fill all fields", success: false})
        }

        if(!validator.isEmail(email)){
            return res.status(200).json({message: 'Please enter a valid Email', success: false})
        }

        if(password.length < 6){
            return res.status(200).json({message: 'Password is weak', success: false})
        }

        const exist = await UserModel.findOne({email: email})
        if(exist){
            return res.status(200).json({message: "User Already Exists", success: false})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = UserModel({
            email: email,
            fullName: fullName,
            password: hashedPassword
        })

        if(newUser){
            jwtToken(newUser._id, res)
            const {password: pass, ...user} = newUser._doc
            await newUser.save()
            return res.status(200).json({message: "User Registered", success: true, user: user})
        }
        else{
            return res.status(200).json({message: "Invalid User Data", success: false})
        }
    }
    catch(err){
        console.log(`Error in Sign Up Controller - ${err}`)
        return res.status(200).json({message: 'Internal Server Error'})
    }
}

export const loginController = async(req, res) =>{
    try{
        const { email, password } = req.body

        if(!email || !password){
            return res.status(200).json({message: "Please fill all fields", success: false})
        }

        const exist = await UserModel.findOne({email: email})
        console.log(exist)
        if(!exist){
            return res.status(200).json({message: "Invalid Credentials", success: false})
        }

        const verifyPassword = await bcrypt.compare(password, exist.password)
        if(!verifyPassword){
            return res.status(200).json({message: "Invalid Credentials", success: false})
        }

        jwtToken(exist._id, res)
        const {password: pass, ...user} = exist._doc
        return res.status(200).json({message: "Logged in", success: true, user: user})
    }
    catch(err){
        console.log(`Error in Login Controller - ${err}`)
        return res.status(200).json({message: 'Internal Server Error'})
    }
}

export const logoutController = async(req, res) =>{
    try{
        res.clearCookie('token')
        return res.status(200).json({message: "Logged out", success: true})
    }
    catch(err){
        console.log(`Error in Logout Controller - ${err}`)
        return res.status(200).json({message: 'Internal Server Error'})
    }
}

export const verifyTokenController = async(req, res) =>{
    try{
        return res.status(200).json({user: req.user._doc, success: true})
    }
    catch(err){
        console.log(`Error in Verify Token Controller - ${err}`)
        return res.status(200).json({message: 'Internal Server Error'})
    }
}

export const updateProfileController = async(req, res) =>{
    try{
        const profilePic = req?.files?.profilePic?.[0]
        const userId = req.user._id

        if(!profilePic){
            return res.status(200).json({message: "Please Add Profile Picture", success: false})
        }

        let result = await cloudinary.v2.uploader.upload(profilePic.path, {resource_type: 'image'})
        imageURL = result.secure_url

        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            profilePic: imageURL
        }, {new: true})

        return res.status(200).json({message: "Profile Picture Added", success: true, user: updatedUser})
    }
    catch(err){
        console.log(`Error in Update Profile Controller - ${err}`)
        return res.status(200).json({message: 'Internal Server Error'})
    }
}

//export { signupController, loginController, logoutController, verifyTokenController, updateProfileController }