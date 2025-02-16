import { create } from "zustand";
import { Axios } from "../utils/Axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) =>({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    isSendMessageLoading: false,

    getUser: async(navigate) =>{
        set({isUserLoading: true})
        try{
            const response = await Axios.get(`/api/message/get/users`)
            if(response.data.message == "Internal Server Error"){
                navigate("/500")
            }
            if(response.data.success){
                set({users: response.data.otherUsers})
            }
            if(!response.data.success){
                toast.warn(response.data.message)
            }             
        }
        catch(err){
            console.log(`Error in Get User - ${err.message}`)
        }
        finally{
            set({isUserLoading: false})
        }
    },

    getMessage: async(navigate, userToChatId) =>{
        set({isMessageLoading: true})
        try{
            const response = await Axios.get(`/api/message/get/message/${userToChatId}`)
            if(response.data.message == "Internal Server Error"){
                navigate("/500")
            }
            if(response.data.success){
                set({messages: response.data.messages})
            }
            if(!response.data.success){
                toast.warn(response.data.message)
            }             
        }
        catch(err){
            console.log(`Error in Get Message - ${err.message}`)
        }
        finally{
            set({isMessageLoading: false})
        }
    },

    sendMessage: async(event, navigate, text, image, settext, setimage) =>{
        event.preventDefault()
        set({isSendMessageLoading: true})
        const { selectedUser, messages } = get()
        try{
            const formData = new FormData()
            formData.append("text", text)
            formData.append("image", image)

            const response = await Axios.post(`/api/message/send/${selectedUser._id}`, formData)
            if(response.data.message == "Internal Server Error"){
                navigate("/500")
            }
            if(response.data.success){
                set({messages: [...messages, response.data.newMessage]})
                settext("")
                setimage(null)
            }
            if(!response.data.success){
                toast.warn(response.data.message)
            }             
        }
        catch(err){
            console.log(`Error in Send Message - ${err.message}`)
        }
        finally{
            set({isSendMessageLoading: false})
        }
    },

    subscribeToMessages: () =>{
        const { selectedUser, messages } = get()
        if(!selectedUser){
            return;
        }

        const socket = useAuthStore.getState().socket
        socket.on("newMessage", (newMessage) =>{
            if(newMessage.senderId !== selectedUser._id){
                return;
            }
            set({messages: [...messages, newMessage]})
        })
    },

    unsubscribeFromMessages: () =>{
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) =>{
        set({selectedUser: selectedUser})
    }
}))