// app/components/MessageTemplates.tsx
'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check, X } from 'lucide-react'

interface MessageTemplatesProps {
  darkMode: boolean
  onSelect: (text: string) => void
  onClose: () => void
}

const templates = [
  { id: 'compliment', text: 'You\'re doing amazing work! Keep it up 💪', category: 'Compliments' },
  { id: 'feedback', text: 'I really appreciate your content. It\'s helped me a lot 🙏', category: 'Feedback' },
  { id: 'question', text: 'Quick question: Would you ever consider doing a tutorial on this? 🤔', category: 'Questions' },
  { id: 'support', text: 'Just wanted to say I\'m rooting for you! You\'ve got this ❤️', category: 'Support' },
  { id: 'idea', text: 'I have an idea I think you\'d love. Can we chat? 💡', category: 'Ideas' },
  { id: 'thanks', text: 'Thank you for being so open and authentic. It means a lot 🙌', category: 'Thanks' },
  { id: 'inspiration', text: 'Your journey is truly inspiring. Thank you for sharing it ✨', category: 'Inspiration' },
  { id: 'community', text: 'The community you\'re building is incredible. So glad to be part of it 🌟', category: 'Community' },
]

export function MessageTemplates({ darkMode, onSelect, onClose }: MessageTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [copied, setCopied] = useState<string | null>(null)

  const categories = ['All', ...new Set(templates.map(t => t.category))]

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  const handleSelect = (text: string) => {
    onSelect(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  const themeClasses = {
    bg: darkMode ? 'bg-black' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-500',
    card: darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200/50',
    button: darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200',
    input: darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900', // ADD THIS
  }

  return (
    <div className={`${themeClasses.card} rounded-2xl border p-4 max-w-md`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-blue-500" />
          <h3 className={`font-medium ${themeClasses.text}`}>Message Templates</h3>
        </div>
        <button 
          onClick={onClose} 
          className={`p-1 rounded-lg ${themeClasses.input} transition hover:scale-110`}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-xl text-xs transition ${
              selectedCategory === category
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : themeClasses.button
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template.text)}
            className={`w-full p-3 rounded-xl text-sm text-left transition group ${
              themeClasses.button
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`${themeClasses.text}`}>{template.text}</span>
              {copied === template.text ? (
                <Check size={16} className="text-green-500 shrink-0" />
              ) : (
                <Copy size={14} className="opacity-0 group-hover:opacity-100 transition text-gray-400 shrink-0" />
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{template.category}</div>
          </button>
        ))}
      </div>
    </div>
  )
}