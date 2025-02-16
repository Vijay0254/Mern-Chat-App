import MessageModel from "../models/MessageModel.js"
import UserModel from "../models/UserModel.js"
import cloudinary from'cloudinary'
import { getReceiverSocketId, io } from "../utils/socket.js"

export const getMessageController = async(req, res) =>{
    try{
        const userToChatId = req.params.id
        const senderId = req.user._id

        const message = await MessageModel.find({
            $or: [
                {senderId: senderId, receiverId: userToChatId }, { senderId: userToChatId, receiverId: senderId}
            ]
        })
        return res.status(200).json({success: true, messages: message})
    }
    catch(err){
        console.log(`Error in Get Message Controller - ${err}`)
        return res.status(200).json({message: 'Internal Server Error'})
    }
}

export const getUsersController = async(req, res) =>{
    try{
        const loggedInUser = req.user._id
        const otherUsers = await UserModel.find({_id: {$ne: loggedInUser}}).select("-password")
        return res.status(200).json({success: true, otherUsers: otherUsers})
    }
    catch(err){
        console.log(`Error in Get Users Controller - ${err}`)
        return res.status(200).json({message: 'Internal Server Error'})
    }
}

export const sendMessageController = async(req, res) =>{
    try{
        const { text } = req.body
        const receiverId = req.params.id
        const senderId = req.user._id

        const image = req?.files?.image?.[0]

        let imageURL
        if(image){
            let result = await cloudinary.v2.uploader.upload(image.path, {resource_type: 'image'})
            imageURL = result.secure_url
        }

        const newMessage = MessageModel({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageURL
        })
        await newMessage.save()

        //To send data in real time
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        return res.status(200).json({success: true, message: "Message Sent", newMessage: newMessage})
    }
    catch(err){
        console.log(`Error in Send Message Controller - ${err}`)
        return res.status(200).json({message: 'Internal Server Error'})
    }
}

//module.exports = { getMessageController, getUsersController, sendMessageController }

