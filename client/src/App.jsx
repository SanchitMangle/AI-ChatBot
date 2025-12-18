import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Routes, Route, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Login from './pages/Login'
import Credit from './pages/Credit'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'

const App = () => {


  const { user, loadingUser } = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading' || loadingUser) return <Loading />

  return (
    <>
      <Toaster />
      {!isMenuOpen && <img src={assets.menu_icon} aria-label="Open Menu" className='fixed top-3 left-3 z-50 w-8 h-8 cursor-pointer md:hidden not-dark:invert bg-black/20 backdrop-blur-sm rounded-md p-1' onClick={() => setIsMenuOpen(true)} />}

      {user ? (
        <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white transition-colors duration-500'>
          <div className='flex h-screen w-screen overflow-hidden'>
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path='/' element={<ChatBox />} />
              <Route path='/credits' element={<Credit />} />
              <Route path='/community' element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen '>
          <Login />
        </div>
      )}



    </>
  )
}

export default App
