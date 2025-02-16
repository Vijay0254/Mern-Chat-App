const socket = require("socket.io")
const http = require('http')
const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const server = http.createServer(app)

const io = new socket.Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL]
    }
})

const getReceiverSocketId = (userId) =>{
    return userSocketMap[userId]
}

//Used to store online Users
const userSocketMap = {}

io.on("connection", (socket) =>{
    console.log("A user connected", socket.id)
    
    const userId = socket.handshake.query.userId
    if(userId){
        userSocketMap[userId] = socket.id
    }
    //It senda event to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () =>{
        console.log("A user disconnected", socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

module.exports = { io, server, app, getReceiverSocketId }