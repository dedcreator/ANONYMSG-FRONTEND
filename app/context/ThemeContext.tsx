// app/context/ThemeContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
  darkMode: boolean
  toggleTheme: () => void
  profileTheme: string
  setProfileTheme: (theme: string) => void
  customFont: string
  setCustomFont: (font: string) => void
  customCSS: string
  setCustomCSS: (css: string) => void
}

export const THEMES = {
  dark: {
    name: 'Dark',
    bg: '#0B0F19',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    card: 'rgba(15, 23, 42, 0.75)',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: '#3b82f6',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
  light: {
    name: 'Light',
    bg: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
    card: '#ffffff',
    border: 'rgba(0, 0, 0, 0.06)',
    accent: '#3b82f6',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  neon: {
    name: 'Neon',
    bg: '#0a0a0a',
    text: '#00ff41',
    textSecondary: 'rgba(0,255,65,0.6)',
    card: 'rgba(0,255,65,0.05)',
    border: 'rgba(0,255,65,0.15)',
    accent: '#00ff41',
    shadow: 'rgba(0,255,65,0.2)',
  },
  minimal: {
    name: 'Minimal',
    bg: '#f5f5f5',
    text: '#1a1a1a',
    textSecondary: '#666666',
    card: '#ffffff',
    border: '#e0e0e0',
    accent: '#1a1a1a',
    shadow: 'rgba(0,0,0,0.06)',
  },
  sunset: {
    name: 'Sunset',
    bg: '#1a0a1a',
    text: '#ff6b6b',
    textSecondary: 'rgba(255,107,107,0.6)',
    card: 'rgba(255,107,107,0.05)',
    border: 'rgba(255,107,107,0.15)',
    accent: '#ff6b6b',
    shadow: 'rgba(255,107,107,0.2)',
  },
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true)
  const [profileTheme, setProfileTheme] = useState('dark')
  const [customFont, setCustomFont] = useState('inter')
  const [customCSS, setCustomCSS] = useState('')

  // Sync dark class on <html> document element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      if (darkMode) {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.remove('dark')
        root.classList.add('light')
      }
    }
  }, [darkMode])

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      const isDark = saved === 'true'
      setDarkMode(isDark)
      if (typeof window !== 'undefined') {
        const root = document.documentElement
        if (isDark) {
          root.classList.add('dark')
          root.classList.remove('light')
        } else {
          root.classList.remove('dark')
          root.classList.add('light')
        }
      }
    }
    const savedTheme = localStorage.getItem('profileTheme')
    if (savedTheme) {
      setProfileTheme(savedTheme)
    }
    const savedFont = localStorage.getItem('customFont')
    if (savedFont) {
      setCustomFont(savedFont)
    }
    const savedCSS = localStorage.getItem('customCSS')
    if (savedCSS) {
      setCustomCSS(savedCSS)
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
  }

  const handleSetProfileTheme = (theme: string) => {
    setProfileTheme(theme)
    localStorage.setItem('profileTheme', theme)
  }

  const handleSetCustomFont = (font: string) => {
    setCustomFont(font)
    localStorage.setItem('customFont', font)
  }

  const handleSetCustomCSS = (css: string) => {
    setCustomCSS(css)
    localStorage.setItem('customCSS', css)
  }

  return (
    <ThemeContext.Provider value={{
      darkMode,
      toggleTheme,
      profileTheme,
      setProfileTheme: handleSetProfileTheme,
      customFont,
      setCustomFont: handleSetCustomFont,
      customCSS,
      setCustomCSS: handleSetCustomCSS,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}