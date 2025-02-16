import express from "express";
import { server, app } from './utils/socket'

import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import path from "path"

//Path of Router, Database and Cloudinary
import connectDb from './db/connectDb'
import connectCloudinary from './utils/cloudinary'
import authRouter from './router/authRouter'
import messageRouter from './router/messageRouter'

dotenv.config()
const PORT = process.env.PORT
const __dirname = path.resolve()

//Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//Path of API
app.use('/api/auth', authRouter)
app.use('/api/message' ,messageRouter)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../Frontend/dist")))

    app.get("*", (req, res) =>{
        res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"))
    })
}

server.listen(PORT, (err) =>{
    err ? console.log(`Error in Running Server - ${err}`) : console.log(`Server Running in Port ${PORT}`)
    connectDb()
    connectCloudinary()
})