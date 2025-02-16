import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Image, Loader, Send, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MessageInput = () => {

    const [text, settext] = useState("")
    const [image, setimage] = useState(null)
    const fileInputRef = useRef(null)

    const { sendMessage, isSendMessageLoading } = useChatStore()

    function removeImage(){
        setimage(null)
        fileInputRef.current.value = ""
    }

    const navigate = useNavigate()

  return (
    <section className='p-4 w-full'> 
        {image && (
            <div className='mb-3 flex items-center gap-2'>
                <div className='relative'>
                    <img src={URL.createObjectURL(image)} alt="image" className='size-20 rounded-lg border border-zinc-700 object-cover' />
                    <button onClick={() =>removeImage()} className='absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center' type='button'><X className='size-3' /></button>
                </div>
            </div>
        )}

        <form onSubmit={(event) =>sendMessage(event, navigate, text, image, settext, setimage)} className='flex items-center gap-2'>
            <div className='flex-1 flex gap-2'>
                <input type="text" className='w-full input input-bordered rounded-lg input-sm' placeholder='Type a message...' value={text} onChange={(event) =>settext(event.target.value)} />
                <input type="file" accept='image/*' className='hidden' ref={fileInputRef} onChange={() =>setimage(fileInputRef.current.files[0])} />
                <button onClick={() =>fileInputRef.current?.click()} type='button' className={`hidden mt-[-5px] sm:flex btn btn-circle ${image ? "text-emerald-500" : "text-zinc-400"}`}><Image size={20} /></button>
            </div>
            {!isSendMessageLoading ?
                <button type="submit" className='btn btn-circle' disabled={!text.trim() && !image}><Send size={22} /></button>:
                <span className="loading mt-[-2px] loading-spinner loading-md text-primary"></span>
            }
        </form>
    </section>
  )
}

export default MessageInput