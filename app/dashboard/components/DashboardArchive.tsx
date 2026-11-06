// app/dashboard/components/DashboardArchive.tsx
'use client'

import { useState } from 'react'
import { 
  Archive, Eye, MessageSquare, Clock, User, 
  Trash2, RotateCcw, Inbox, Search, X,
  CheckCircle, AlertCircle, Calendar
} from 'lucide-react'
import { Message } from '../types'
import { motion, AnimatePresence } from 'framer-motion'

interface DashboardArchiveProps {
  archivedMessages: Message[]
  darkMode: boolean
  onRestore: (id: number) => void
  onPermanentDelete: (id: number) => void
  onMarkAsRead: (id: number) => void
}

export function DashboardArchive({ 
  archivedMessages, 
  darkMode, 
  onRestore, 
  onPermanentDelete,
  onMarkAsRead
}: DashboardArchiveProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMessages, setSelectedMessages] = useState<number[]>([])
  const [selectMode, setSelectMode] = useState(false)

  const filteredMessages = archivedMessages.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelectMessage = (id: number) => {
    setSelectedMessages(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([])
    } else {
      setSelectedMessages(filteredMessages.map(m => m.id))
    }
  }

  const restoreSelected = () => {
    selectedMessages.forEach(id => onRestore(id))
    setSelectedMessages([])
    setSelectMode(false)
  }

  const deleteSelected = () => {
    if (confirm(`Permanently delete ${selectedMessages.length} messages?`)) {
      selectedMessages.forEach(id => onPermanentDelete(id))
      setSelectedMessages([])
      setSelectMode(false)
    }
  }

    const themeClasses = {
    text: darkMode ? 'text-white' : 'text-slate-900',
    textSecondary: darkMode ? 'text-slate-400' : 'text-slate-500',
    card: darkMode ? 'bg-slate-900/60 border border-slate-800 backdrop-blur-xl hover:border-blue-500/30' : 'bg-white border border-slate-200 shadow-sm hover:border-blue-500/30',
    hover: darkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50/80',
    input: darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20',
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className={`text-2xl font-extrabold tracking-tight ${themeClasses.text}`}>Archive</h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${themeClasses.textSecondary}`}>
            {archivedMessages.length} preserved anonymous messages
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectMode(!selectMode)}
            className={`px-4 py-2.5 rounded-xl transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 border ${
              selectMode
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25'
                : darkMode 
                ? 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <Archive size={16} />
            <span>{selectMode ? 'Cancel Selection' : 'Bulk Select'}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search archived messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full ${themeClasses.input} rounded-2xl pl-10 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all`}
        />
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectMode && selectedMessages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 ${darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-gray-100/80 border border-gray-200'}`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-sm ${themeClasses.textSecondary}`}>
                {selectedMessages.length} selected
              </span>
              <button onClick={selectAll} className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline font-medium`}>
                {selectedMessages.length === filteredMessages.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={restoreSelected} className="px-4 py-2 rounded-xl text-sm flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 transition">
                <RotateCcw size={14} /> Restore
              </button>
              <button onClick={deleteSelected} className="px-4 py-2 rounded-xl text-sm flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 transition">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages List */}
      <AnimatePresence>
        {filteredMessages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-2xl p-16 text-center border border-dashed`}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Archive className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className={`text-lg font-medium ${themeClasses.text} mb-2`}>Archive is empty</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'Try a different search term' : 'Messages you archive will appear here'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`${themeClasses.card} rounded-2xl p-4 transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  {selectMode && (
                    <input 
                      type="checkbox" 
                      checked={selectedMessages.includes(message.id)} 
                      onChange={() => toggleSelectMessage(message.id)} 
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" 
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <MessageSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
                      <p className={`${themeClasses.textSecondary} text-sm leading-relaxed break-words`}>
                        {message.content}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(message.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        Anonymous
                      </span>
                      {message.is_read && (
                        <span className="flex items-center gap-1 text-green-500">
                          <CheckCircle size={12} /> Read
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 shrink-0">
                    {!message.is_read && (
                      <button 
                        onClick={() => onMarkAsRead(message.id)} 
                        className={`p-1.5 rounded-xl transition ${themeClasses.hover}`}
                        title="Mark as read"
                      >
                        <Eye size={14} className="text-gray-500" />
                      </button>
                    )}
                    <button 
                      onClick={() => onRestore(message.id)} 
                      className={`p-1.5 rounded-xl transition hover:bg-green-500/10`}
                      title="Restore"
                    >
                      <RotateCcw size={14} className="text-green-400 hover:text-green-500" />
                    </button>
                    <button 
                      onClick={() => onPermanentDelete(message.id)} 
                      className={`p-1.5 rounded-xl transition hover:bg-red-500/10`}
                      title="Permanently delete"
                    >
                      <Trash2 size={14} className="text-red-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}