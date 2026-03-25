import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import useThemeStore from './store/themeStore'

function ThemeInitializer() {
  const theme = useThemeStore((state) => state.theme)
  
  if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }
  
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeInitializer />
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
