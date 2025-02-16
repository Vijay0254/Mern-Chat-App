import express from "express";
// const app = express()
const { server, app } = require('./utils/socket')

const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT
const cors = require('cors')
const cookieParser = require('cookie-parser')

const path = require("path")
const __dirname = path.resolve()

//Path of Router, Database and Cloudinary
const connectDb = require('./db/connectDb')
const connectCloudinary = require('./utils/cloudinary')
const authRouter = require('./router/authRouter')
const messageRouter = require('./router/messageRouter')

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