// app/dashboard/components/DashboardCustomization.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTheme, THEMES } from '@/app/context/ThemeContext'
import { Palette, Code, Check, Sparkles, Eye, X, Type, Moon, Sun, Monitor, Zap, Sunset } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DashboardCustomizationProps {
  darkMode: boolean
  onSave?: (data: any) => void
}

const fonts = [
  { name: 'Inter', value: 'inter' },
  { name: 'Geist Sans', value: 'geist' },
  { name: 'Poppins', value: 'poppins' },
  { name: 'Space Grotesk', value: 'space-grotesk' },
  { name: 'JetBrains Mono', value: 'jetbrains-mono' },
  { name: 'Playfair Display', value: 'playfair-display' },
]

const themeOptions = [
  { id: 'dark', label: 'Dark', icon: Moon, color: '#1a1a1a' },
  { id: 'light', label: 'Light', icon: Sun, color: '#ffffff' },
  { id: 'neon', label: 'Neon', icon: Zap, color: '#00ff41' },
  { id: 'minimal', label: 'Minimal', icon: Monitor, color: '#f5f5f5' },
  { id: 'sunset', label: 'Sunset', icon: Sunset, color: '#ff6b6b' },
]

export function DashboardCustomization({ darkMode, onSave }: DashboardCustomizationProps) {
  const { profileTheme, setProfileTheme, customFont, setCustomFont, customCSS, setCustomCSS } = useTheme()
  const [cssCode, setCssCode] = useState(customCSS || '')
  const [preview, setPreview] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setCssCode(customCSS || '')
  }, [customCSS])

  const handleSave = () => {
    setCustomCSS(cssCode)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    if (onSave) {
      onSave({ theme: profileTheme, font: customFont, css: cssCode })
    }
  }

  const themeClasses = {
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-500',
    card: darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200/50',
    input: darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400',
    button: darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200',
  }

  return (
    <div className="space-y-4">
      {/* Theme Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={16} className="text-purple-500" />
          <h4 className={`text-sm font-medium ${themeClasses.text}`}>Profile Theme</h4>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {themeOptions.map((theme) => {
            const Icon = theme.icon
            return (
              <button
                key={theme.id}
                onClick={() => setProfileTheme(theme.id)}
                className={`p-2 rounded-xl text-center transition-all ${
                  profileTheme === theme.id
                    ? 'ring-2 ring-blue-500 bg-blue-500/10'
                    : darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Icon size={20} className={`mx-auto ${profileTheme === theme.id ? 'text-blue-500' : themeClasses.textSecondary}`} />
                <div className={`text-[10px] font-medium ${themeClasses.text} mt-1`}>{theme.label}</div>
                <div 
                  className="w-full h-1 rounded-full mt-1 mx-auto max-w-[30px]"
                  style={{ background: theme.color }}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Font Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type size={16} className="text-blue-500" />
          <h4 className={`text-sm font-medium ${themeClasses.text}`}>Custom Font</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fonts.map((font) => (
            <button
              key={font.value}
              onClick={() => setCustomFont(font.value)}
              className={`p-2 rounded-xl text-xs transition-all ${
                customFont === font.value
                  ? 'ring-2 ring-blue-500 bg-blue-500/10'
                  : darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={{ fontFamily: font.value }}
            >
              <span className={`${themeClasses.text} font-medium`}>{font.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code size={16} className="text-green-500" />
            <h4 className={`text-sm font-medium ${themeClasses.text}`}>Custom CSS</h4>
          </div>
          <button
            onClick={() => setPreview(!preview)}
            className={`px-2 py-1 rounded-lg text-xs transition flex items-center gap-1 ${themeClasses.button}`}
          >
            <Eye size={12} />
            {preview ? 'Hide' : 'Preview'}
          </button>
        </div>
        <textarea
          value={cssCode}
          onChange={(e) => setCssCode(e.target.value)}
          placeholder="/* Add your custom CSS here */"
          className={`w-full ${themeClasses.input} rounded-xl p-3 text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition resize-none min-h-[80px]`}
        />
        <AnimatePresence>
          {preview && cssCode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 p-3 rounded-xl border border-gray-200/50 dark:border-white/10"
            >
              <style>{cssCode}</style>
              <div className="text-xs text-green-500 flex items-center gap-2">
                <Check size={12} />
                Custom CSS applied
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleSave}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-semibold transition shadow-sm flex items-center justify-center gap-2"
      >
        {saved ? (
          <>
            <Check size={14} />
            Saved!
          </>
        ) : (
          <>
            <Sparkles size={14} />
            Apply Customizations
          </>
        )}
      </button>
    </div>
  )
}