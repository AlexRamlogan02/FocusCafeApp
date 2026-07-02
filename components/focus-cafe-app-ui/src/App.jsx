import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header.component.jsx'
import Footer from './components/Footer.component.jsx'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen flex flex-col bg-[var(--primary)] text-[var(--text-color)] transition-colors">
      <Header darkMode={darkMode} onToggleDarkMode={(state) => setDarkMode(state)} />

      <main className="flex-1 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  )
}

export default App
