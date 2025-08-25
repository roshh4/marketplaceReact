'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMarketplace } from '../state/MarketplaceContext.jsx'
import Profile from '../components/profile/Profile.jsx'
import ChatPage from '../components/chat/ChatPage.jsx'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfileRoute() {
  const navigate = useNavigate()
  const { user } = useMarketplace()
  const [activeChat, setActiveChat] = useState(null)

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  const handleBack = () => navigate('/marketplace')
  const handleOpenChat = (chatId) => setActiveChat(chatId)
  const closeChat = () => setActiveChat(null)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#061028] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#061028] text-white font-sans">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Profile onOpenChat={handleOpenChat} onBack={handleBack} />
      </motion.div>
      <AnimatePresence>{activeChat && <ChatPage chatId={activeChat} onClose={closeChat} />}</AnimatePresence>
    </div>
  )
}


