import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header.component.jsx'

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <>
      <button
        className="theme-toggle"
        type="button"
        onClick={() => setIsDark((current) => !current)}
        aria-pressed={isDark}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? 'Light mode' : 'Dark mode'}
      </button>
      <Header />
      <main className="outlet-container">
        <div key={location.pathname} className="route-transition">
          <Outlet />
        </div>
      </main>
    </>
  )
}

export default App
