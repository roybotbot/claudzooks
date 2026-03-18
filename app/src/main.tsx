import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AllFeatures from './AllFeatures.tsx'

const isAllFeatures = window.location.pathname === '/all-features'

createRoot(document.getElementById('root')!).render(
  isAllFeatures ? <AllFeatures /> : <App />
)
