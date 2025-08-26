import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'

const Loading = () => {

  const { navigate,fetchUser } = useAppContext()

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUser();
      navigate('/');
    }, 8000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className='bg-gradient-to-b from-[#531B181] to-[#29184B] backdr op-opacity-60 flex items-center justify-center h-screen w-screen text-2xl  text-white'>
      <div className='w-10 h-10 rounded-full border-3 boeder-white border-t-transparent animate-spin'></div>
    </div>
  )
}

export default Loading
