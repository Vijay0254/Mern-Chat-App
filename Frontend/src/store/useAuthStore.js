import { Axios } from '../utils/Axios'
import { create } from 'zustand'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'

export const useAuthStore = create((set, get) =>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    //Whole display loading
    isCheckingAuth: true,

    onlineUser: [],
    socket: null,

    verifyToken: async(navigate) =>{
        try{
            const response = await Axios.get('/api/auth/verify')
            if(response.data.message == "Internal Server Error"){
                navigate("/500")
            }
            if(response.data.success){
                set({authUser: response.data.user})
                get().connectSocket()
            }
        }
        catch(err){
            set({authUser: null})
            console.log(`Error in Verify Token - ${err.message}`)
        }
        finally{
            set({isCheckingAuth: false})
        }
    },

    signUp: async(event, navigate, formData, setformData) =>{
        event.preventDefault()
        set({isSigningUp: true})
        try{
            const response = await Axios.post('/api/auth/signup', formData)
            if(response.data.message == "Internal Server Error"){
                navigate("/500")
            }
            if(response.data.success){
                set({authUser: response.data.user})
                setformData({
                    fullName: "",
                    email: "",
                    password: ""
                })
                toast.success("Account Created Successfully")
                get().connectSocket()
            }
            if(!response.data.success){
                toast.warn(response.data.message)
            }   
        }
        catch(err){
            console.log(`Error in Sign Up - ${err.message}`)
        }
        finally{
            set({isSigningUp: false})
        }
    },

    login: async(event, navigate, formData, setformData) =>{
        event.preventDefault()
        set({isLoggingIn: true})
        try{
            const response = await Axios.post('/api/auth/login', formData)
            if(response.data.message == "Internal Server Error"){
                navigate("/500")
            }
            if(response.data.success){
                set({authUser: response.data.user})
                setformData({
                    email: "",
                    password: ""
                })
                toast.success("Login Successful")

                get().connectSocket()
            }
            if(!response.data.success){
                toast.warn(response.data.message)
            }   
        }
        catch(err){
            console.log(`Error in Login - ${err.message}`)
        }
        finally{
            set({isLoggingIn: false})
        }
    },

    logout: async(navigate) =>{
        try{
            const response = await Axios.get('/api/auth/logout')
            if(response.data.message == "Internal Server Error"){
                navigate("/500")
            }
            if(response.data.success){
                set({authUser: null})
                toast.success("Logout Success")
                get().disconnectSocket()
            }
            if(!response.data.success){
                toast.warn(response.data.message)
            }  
        }
        catch(err){
            console.log(`Error in Logout - ${err.message}`)
        }
    },

    updateProfile: async(event, navigate) =>{
        set({isUpdatingProfile: true})
        try{
            const formData = new FormData()
            formData.append("profilePic", event.target.files[0])

            const response = await Axios.put('/api/auth/update/profile', formData)
            if(response.data.message == "Internal Server Error"){
                navigate("/500")
            }
            if(response.data.success){
                set({authUser: response.data.user})
                toast.success("Profile Picture Added")
            }
            if(!response.data.success){
                toast.warn(response.data.message)
            }   
        }
        catch(err){
            console.log(`Error in Update Profile - ${err.message}`)
        }
        finally{
            set({isUpdatingProfile: false})
        }
    },

    connectSocket: () =>{
        const { authUser } = get()
        if(!authUser || get().socket?.connected){
            return;
        }
        const socket = io(import.meta.env.VITE_MODE == "development" ? import.meta.env.VITE_BACKEND_URL : "/", {
            query: {
                userId: authUser._id
            }
        })
        socket.connect()

        set({socket: socket})

        socket.on("getOnlineUsers", (userId) =>{
            set({ onlineUser: userId })
        })
    },
    disconnectSocket: () =>{
        if(get().socket?.connected) {
            get().socket.disconnect()
        }
    }
}))