import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from '../components/Message'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const { selectedChat, theme, user, setUser, axios, token } = useAppContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)

  const containerRef = useRef(null)

  const onSubmitHandler = async (e) => {

    try {
      e.preventDefault();
      if (!user) return toast("login to send message")
      setLoading(true)

      const promptCopy = prompt
      setPrompt('')
      setMessages(prev => [...prev, { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])

      const { data } = await axios.post(`/api/message/${mode}`, { chatId: selectedChat._id, prompt, isPublished }, { headers: { AUthorization: token } })

      if (data.success) {
        setMessages(prev => [...prev, data.reply])
        // deduct credits
        if (mode === 'image') {
          setUser(prev => ({ ...prev, credits: prev.credits - 2 }))
        } else {
          setUser(prev => ({ ...prev, credits: prev.credits - 1 }))
        }
      } else {
        toast.error(data.message)
        setPrompt(promptCopy)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setPrompt('')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40 '>

      {/* Chat Messages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-auto pr-2 scroll-smooth'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-6 text-primary'>
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} className='w-full max-w-56 sm:max-w-68 opacity-80 hover:opacity-100 transition-opacity' alt="QuickGPT Logo" />
            <p className='text-3xl sm:text-5xl font-semibold text-center text-gray-400 dark:text-white/80'>Ask me anything </p>
          </div>
        )}

        <div className='space-y-6'>
          {messages.map((message, index) => <Message key={index} message={message} />)}
        </div>

        {/* Loading state three dots */}
        {
          loading && <div className='loader flex items-center gap-1.5 mt-4 ml-2'>
            <div className='w-2 h-2 rounded-full bg-primary/60 dark:bg-white/60 animate-bounce'></div>
            <div className='w-2 h-2 rounded-full bg-primary/60 dark:bg-white/60 animate-bounce [animation-delay:-0.15s]'></div>
            <div className='w-2 h-2 rounded-full bg-primary/60 dark:bg-white/60 animate-bounce [animation-delay:-0.3s]'></div>
          </div>
        }

      </div>

      <div className='max-w-3xl w-full mx-auto'>
        {
          mode === 'image' && (
            <label className='inline-flex items-center gap-2 mb-4 text-xs mx-auto cursor-pointer text-gray-500 hover:text-primary transition-colors'>
              <input onChange={(e) => setIsPublished(e.target.checked)}
                type="checkbox" className='cursor-pointer accent-primary' checked={isPublished} />
              <span>Publish Generated Image To Community</span>
            </label>
          )
        }

        {/* Prompt Input Box */}
        <form onSubmit={onSubmitHandler} className='bg-primary/5 dark:bg-white/5 border border-primary/20 dark:border-white/10 rounded-2xl w-full p-2 pl-4 flex gap-3 items-center backdrop-blur-md focus-within:ring-2 focus-within:ring-primary/30 transition-all'>
          <select
            onChange={(e) => setMode(e.target.value)}
            value={mode}
            className='text-xs font-medium bg-transparent border-r border-gray-300 dark:border-white/10 pr-3 outline-none cursor-pointer hover:text-primary transition-colors'
            aria-label="Select generation mode">
            <option className='dark:bg-[#1a1a1a]' value="text">Text</option>
            <option className='dark:bg-[#1a1a1a]' value="image">Image</option>
          </select>
          <input
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            type="text"
            placeholder={mode === 'image' ? 'Describe the image you want...' : 'Type your message here...'}
            className='w-full flex-1 text-sm bg-transparent outline-none py-2'
            required
            aria-label="Prompt input"
          />
          <button
            disabled={loading}
            type="submit"
            className='p-2 bg-primary dark:bg-white rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer'
            aria-label={loading ? "Stop Generating" : "Send Message"}>
            <img src={loading ? assets.stop_icon : assets.send_icon} alt="" className='w-6 h-6 not-dark:invert' />
          </button>
        </form>
        <p className='text-[10px] text-center mt-3 text-gray-500 opacity-60'>QuickGPT can provide helpful responses but may occasionally be inaccurate.</p>
      </div>

    </div>
  )
}

export default ChatBox
