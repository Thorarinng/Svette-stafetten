import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { redirectAuthHashToProductionIfNeeded } from './lib/authRedirect'
import './index.css'
import App from './App.tsx'

redirectAuthHashToProductionIfNeeded()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
