import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets.js'
import Moment from 'moment'
import toast from 'react-hot-toast'

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const { chats, setChats, setSelectedChat, theme, setTheme, user, navigate, axios, createNewChats, fetchUserChats, setToken, token } = useAppContext()
  const [search, setSearch] = useState('')

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    toast.success("Logged out Successfully")
  }

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const conform = window.confirm('Are you sure want to delete this chat?')
      if (!conform) return

      const { data } = await axios.post('/api/chat/delete', { chatId }, { headers: { AUthorization: token } })

      if (data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchUserChats()
        toast.success(data.messages)
      }

    } catch (error) {
      toast.error(error.messages)
    }
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-[#242124]/90 bg-white/90 border-r border-r-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 fixed md:static left-0 top-0 z-50 ${!isMenuOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>

        {/* Logo */}
        <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="QuickGPT Logo" className='w-full max-w-48 mb-8' />

        {/* New chat button */}
        <button onClick={createNewChats} aria-label="Create New Chat"
          className='flex items-center justify-center w-full py-2.5 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm font-medium rounded-lg cursor-pointer hover:shadow-lg hover:opacity-90 active:scale-95 transition-all'>
          <span className='mr-2 text-xl'>+</span> New Chat
        </button>

        {/* Search Conversations */}
        <div className='flex items-center gap-2 px-3 py-2 mt-6 border border-gray-300 dark:border-white/10 rounded-lg focus-within:border-primary transition-colors'>
          <img src={assets.search_icon} alt="" className='w-4 dark:opacity-60 not-dark:invert' />
          <input onChange={(e) => setSearch(e.target.value)} value={search}
            type="text" placeholder='Search Conversations' className='text-xs w-full bg-transparent outline-none' />
        </div>

        {/* Recent Chats */}
        {chats.length > 0 && <p className='mt-4 text-sm'>Recent Chats</p>}
        <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'>
          {
            chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
              <div onClick={() => { navigate('/'); setSelectedChat(chat); setIsMenuOpen(false) }}
                key={chat._id} className='p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group'>
                <div>
                  <p className='truncate w-full'>
                    {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>{Moment(chat.updatedAt).fromNow()}</p>
                </div>
                <img onClick={e => toast.promise(deleteChat(e, chat._id), { loading: 'deleting...' })} src={assets.bin_icon} alt="" className='hidden group-hover:block w-4 cursor-pointer not-dark:invert' />
              </div>
            ))
          }
        </div>

        {/* Ommunity Images */}
        <div onClick={() => { navigate('/community'); setIsMenuOpen(false) }} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all '>
          <img src={assets.gallery_icon} alt="" className='w-4.5 not-dark:invert' />
          <div className='flex flex-col text-sm'>
            <p>Community Images</p>
          </div>
        </div>

        {/* Credit Purchase Option */}
        <div onClick={() => { navigate('/credits'); setIsMenuOpen(false) }} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all '>
          <img src={assets.diamond_icon} alt="" className='w-4.5 dark:invert' />
          <div className='flex flex-col text-sm'>
            <p>Credits : {user?.credits}</p>
            <p className='text-xs texr-gray-400'>Purchase credit to use quickgpt</p>
          </div>
        </div>

        {/* Dark mode toggle button */}
        <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md '>
          <div className='flex items-center gap-2  text-sm'>
            <img src={assets.theme_icon} className='w-4 not-dark:invert' alt="" />
            <p>Dark Mode</p>
          </div>
          <label className='relative inline-flex cursor-pointer'>
            <input onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              type="checkbox" className='sr-only peer' checked={theme === 'dark'} />
            <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all'></div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
          </label>
        </div>

        {/* User Account */}
        <div className='flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/10 rounded-lg cursor-pointer group hover:bg-primary/5 transition-colors'>
          <img src={assets.user_icon} alt="User Icon" className='w-7 h-7 rounded-full' />
          <p className='flex-1 text-sm dark:text-primary truncate'>{user ? user.name : 'Login your account'}</p>
          {
            user && <img onClick={logout} src={assets.logout_icon} aria-label="Logout" className='h-5 w-5 cursor-pointer md:hidden group-hover:md:block opacity-60 hover:opacity-100 transition-opacity' />
          }
        </div>

        <button onClick={() => setIsMenuOpen(false)} aria-label="Close Sidebar"
          className='absolute top-3 right-3 p-1 cursor-pointer md:hidden not-dark:invert hover:bg-black/10 rounded-md transition-colors'>
          <img src={assets.close_icon} alt="" className='w-5 h-5' />
        </button>

      </div>
    </>
  )
}

export default Sidebar
