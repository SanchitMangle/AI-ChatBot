import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({ message }) => {

  useEffect(() => {
    Prism.highlightAll()
  }, [message.content])

  return (
    <div className='w-full'>
      {message.role === 'user' ? (
        <div className='flex items-start justify-end mb-6 gap-3 group'>
          <div className='flex flex-col items-end gap-1.5 max-w-[85%] sm:max-w-2xl'>
            <div className='p-3 px-4 bg-[#A456F7] text-white rounded-2xl rounded-tr-none shadow-sm hover:shadow-md transition-shadow'>
              <p className='text-sm leading-relaxed'>{message.content}</p>
            </div>
            <span className='text-[10px] text-gray-500 dark:text-[#B1A6C0] font-medium'>{moment(message.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} alt="User" className='w-8 h-8 rounded-full border border-primary/20' />
        </div>
      )
        : (
          <div className='flex items-start gap-3 mb-6 group'>
            <img src={assets.logo} alt="QuickGPT" className='w-8 h-8 rounded-full border border-primary/20 p-1 bg-white dark:bg-white/10' />
            <div className='flex flex-col gap-1.5 max-w-[85%] sm:max-w-2xl'>
              <div className='p-3 px-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl rounded-tl-none shadow-sm hover:shadow-md transition-shadow'>
                {message.isImage ? (
                  <div className='space-y-3'>
                    <img src={message.content} alt="AI Generated" className='w-full max-w-md rounded-lg shadow-inner ring-1 ring-black/5' />
                    <a href={message.content} download target="_blank" className='inline-block text-[10px] px-2 py-1 bg-primary/10 dark:bg-white/10 rounded-md hover:bg-primary/20 transition-colors'>Download Image</a>
                  </div>
                ) : (
                  <div className='text-sm leading-relaxed dark:text-gray-200 reset-tw selection:bg-primary/30'>
                    <Markdown>{message.content}</Markdown>
                  </div>
                )}
              </div>
              <span className='text-[10px] text-gray-500 dark:text-[#B1A6C0] font-medium'>{moment(message.timestamp).fromNow()}</span>
            </div>
          </div>
        )}
    </div>
  )
}

export default Message
