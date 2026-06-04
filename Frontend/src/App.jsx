import { useEffect, useState } from 'react'
import './App.css'
import AppRoutes from './AppRoutes.jsx'

function App() {
  const getSystemTheme = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const [theme, setTheme] = useState(getSystemTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => setTheme(e.matches ? 'dark' : 'light')

    if (mq.addEventListener) mq.addEventListener('change', handleChange)
    else mq.addListener(handleChange)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handleChange)
      else mq.removeListener(handleChange)
    }
  }, [])

  return (
    <div className="app">
      <AppRoutes />
    </div>
  )
}

export default App
