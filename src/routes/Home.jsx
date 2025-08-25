'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMarketplace } from '../state/MarketplaceContext.jsx'
import Login from '../components/auth/Login.jsx'

export default function Home() {
  const { user } = useMarketplace()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/marketplace')
  }, [user, navigate])

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#061028] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirecting to marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#061028] text-white font-sans">
      <Login onLogin={() => navigate('/marketplace')} />
    </div>
  )
}


