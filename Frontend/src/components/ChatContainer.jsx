import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import MessageSkeleton from './Skeletons/MessageSkeleton'
import { useNavigate } from 'react-router-dom'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../utils/formatMessageTime'

const ChatContainer = () => {

    const { messages, getMessage, selectedUser, isMessageLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
    const { authUser } = useAuthStore()

    const navigate = useNavigate()
    const messageEndRef = useRef(null)

    useEffect(() =>{
        getMessage(navigate, selectedUser._id)
        
        subscribeToMessages()

        return () =>unsubscribeFromMessages()
    }, [selectedUser._id, getMessage, subscribeToMessages, unsubscribeFromMessages])

    useEffect(() =>{
        if(messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    if(isMessageLoading){
        return (
            <div className='flex flex-col overflow-auto flex-1'>
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        )
    }

  return (
    <section className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />

        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.map((element) =>(
                <div className={`chat ${element.senderId === authUser._id ? "chat-end" : "chat-start"}`} key={element._id} ref={messageEndRef}>
                    <div className='chat-image avatar'>
                        <div className='size-10 rounded-full border'>
                            <img src={element.senderId === authUser._id ? authUser.profilePic || "/profilePic.png" : selectedUser.profilePic || "/profilePic.png"} alt="profilePic" />
                        </div>
                    </div>
                    <div className='chat-header mb-1'>
                        <time className='text-xs opacity-50 ml-1'>{formatMessageTime(element.createdAt)}</time>
                    </div>
                    <div className='chat-bubble flex flex-col'>
                        {element.image && <img src={element.image} alt="image" className='sm:max-w-[200px] rounded-md mb-2' />}
                        {element.text && <p>{element.text}</p>}
                    </div>
                </div>
            ))}
        </div>

        <MessageInput />
    </section>
  )
}

export default ChatContainer