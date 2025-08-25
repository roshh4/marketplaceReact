import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './routes/Home.jsx'
import MarketplaceRoute from './routes/Marketplace.jsx'
import ProductRoute from './routes/Product.jsx'
import ProfileRoute from './routes/Profile.jsx'
import ListItemRoute from './routes/ListItem.jsx'

import { ThemeProvider } from './state/ThemeContext.jsx'
import { MarketplaceProvider } from './state/MarketplaceContext.jsx'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/marketplace', element: <MarketplaceRoute /> },
  { path: '/product/:id', element: <ProductRoute /> },
  { path: '/profile', element: <ProfileRoute /> },
  { path: '/list-item', element: <ListItemRoute /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MarketplaceProvider>
        <RouterProvider router={router} />
      </MarketplaceProvider>
    </ThemeProvider>
  </StrictMode>,
)
