import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './Skeletons/SidebarSkeleton'
import { Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const Sidebar = () => {

    const { getUser, selectedUser, setSelectedUser, users, isUserLoading } = useChatStore()
    const { onlineUser } = useAuthStore()
    const [showOnlineOnly, setshowOnlineOnly] = useState(false)

    const navigate = useNavigate()

    useEffect(() =>{
        getUser(navigate)
    }, [])

    const filteredUsers = showOnlineOnly ? users.filter((element) =>onlineUser.includes(element._id)) : users

    if(isUserLoading){
        return <SidebarSkeleton />
    }

  return (
    <aside className='h-full w-20 sm:w-28 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>

        <div className='border-b border-base-300 w-full p-5'>
            <div className='flex items-center gap-2'>
                <Users className='size-6' />
                <span className='font-medium hidden lg:block'>Contacts</span>
            </div>
            <div className="mt-3 hidden lg:flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-2">
                    <input type="checkbox" checked={showOnlineOnly} onChange={(e) => setshowOnlineOnly(e.target.checked)} className="checkbox checkbox-sm" />
                    <span className="text-sm">Show online only</span>
                </label>
                <span className="text-xs text-zinc-500">({onlineUser.length - 1} online)</span>
            </div>
        </div>

        <div className='overflow-y-auto w-full py-3'>
            {filteredUsers.map((element) =>(
                <button key={element._id} onClick={() =>setSelectedUser(element)} className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === element._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}>
                    <div className='relative mx-auto lg:mx-0'>
                        <img src={element.profilePic || "/profilePic.png"} alt="profilePic" className='size-12 rounded-full object-cover' />

                        {onlineUser.includes(element._id) && (
                            <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900'></span>
                        )}
                    </div>

                    <div className='hidden lg:block text-left min-w-0'>
                        <div className='font-medium truncate'>
                        {element.fullName}
                    </div>
                        <div className='text-sm text-zinc-400'>
                            {onlineUser.includes(element._id) ? "Online" : "Offline"}
                        </div>
                    </div>
                </button>
            ))}

            {filteredUsers.length === 0 && 
                <div className='text-center text-zinc-500 py-4'>No Online Users</div>
            }
        </div>
    </aside>
  )
}

export default Sidebar