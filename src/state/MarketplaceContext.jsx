'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { uid, nowIso, arraysEq, STORAGE_KEYS } from '../utils.js'

const MarketplaceContext = createContext(null)

function useLocalStorage(key, initial) {
  const [state, setState] = useState(initial)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setState(JSON.parse(raw))
    } catch {}
    setHasHydrated(true)
  }, [key])

  useEffect(() => {
    if (!hasHydrated) return
    try { localStorage.setItem(key, JSON.stringify(state)) } catch {}
  }, [key, state, hasHydrated])

  return [state, setState]
}

export const MarketplaceProvider = ({ children }) => {
  const [products, setProducts] = useLocalStorage(STORAGE_KEYS.PRODUCTS, [])
  const [chats, setChats] = useLocalStorage(STORAGE_KEYS.CHATS, [])
  const [user, setUser] = useLocalStorage(STORAGE_KEYS.USER, null)
  const [favorites, setFavorites] = useLocalStorage('cm_favorites_v1', [])
  const [purchaseRequests, setPurchaseRequests] = useLocalStorage('cm_purchase_requests_v1', [])

  const addProduct = (p) => {
    const prod = { ...p, id: uid('p'), postedAt: nowIso(), status: 'available' }
    setProducts((s) => [prod, ...s])
    return prod
  }

  const updateProductStatus = (productId, status) => {
    setProducts((s) => s.map((p) => (p.id === productId ? { ...p, status } : p)))
  }

  const updateUser = (u) => {
    setUser((cur) => ({ ...(cur || { id: uid('u'), name: 'You' }), ...u }))
  }

  const addChatIfMissing = (productId, participants) => {
    const existing = chats.find((c) => c.productId === productId && arraysEq(c.participants, participants))
    if (existing) return existing
    const c = { id: uid('c'), productId, participants, messages: [] }
    setChats((s) => [c, ...s])
    return c
  }

  const pushMessage = (chatId, from, text) => {
    setChats((s) => s.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, { id: uid('m'), from, text, at: nowIso() }] } : c)))
  }

  const toggleFavorite = (productId) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const createPurchaseRequest = (productId, buyerId, sellerId) => {
    const request = { id: uid('pr'), productId, buyerId, sellerId, status: 'pending', createdAt: nowIso() }
    setPurchaseRequests((s) => [request, ...s])
    return request
  }

  const updatePurchaseRequest = (requestId, status) => {
    setPurchaseRequests((s) => s.map((r) => (r.id === requestId ? { ...r, status } : r)))
    if (status === 'accepted') {
      const request = purchaseRequests.find((r) => r.id === requestId)
      if (request) updateProductStatus(request.productId, 'sold')
    }
  }

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        setProducts,
        addProduct,
        updateProductStatus,
        user,
        updateUser,
        setUser,
        chats,
        setChats,
        addChatIfMissing,
        pushMessage,
        favorites,
        toggleFavorite,
        purchaseRequests,
        createPurchaseRequest,
        updatePurchaseRequest,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  )
}

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext)
  if (!context) throw new Error('useMarketplace must be used within a MarketplaceProvider')
  return context
}


