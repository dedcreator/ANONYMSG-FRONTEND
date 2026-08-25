// app/dashboard/components/DashboardInbox.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Search, Eye, Inbox, Calendar, Zap, Award, MessageSquare, 
  Share2, Flag, Trash2, Download, Clock, User, 
  Archive, AlertCircle, X, Check, Link as LinkIcon,
  Sparkles, MoreHorizontal, ChevronDown, Circle,
  Mic, Play, Pause, Image as ImageIcon,
  Pin, PinOff, Send, Copy,
} from 'lucide-react'
import { Message, Stats } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { VoiceRecorder } from '@/app/components/VoiceRecorder'
import { GIFPicker } from '@/app/components/GIFPicker'
import { MessageTemplates } from '@/app/components/MessageTemplates'
import { 
  FaTwitter, FaInstagram, FaFacebook, FaWhatsapp, FaLinkedin, 
  FaReddit, FaPinterest, FaTelegram, FaDiscord 
} from 'react-icons/fa'

interface DashboardInboxProps {
  messages: Message[]
  stats: Stats
  darkMode: boolean
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  onExport: () => void
  onShareImage: (message: Message) => void  
  onShareLink: () => void
  onReport: (message: Message) => void
  onPinMessage?: (id: string) => void
  onSendMessage?: (content: string, type: string, media?: any) => void
  username?: string
  brandColor?: string
  profilePicture?: string | null
}

export function DashboardInbox({ 
  messages, stats, darkMode, onMarkAsRead, onMarkAllAsRead, onDelete, onArchive, onExport, 
  onShareLink, onReport, onPinMessage, onSendMessage, username = 'user', brandColor = '#3B82F6', profilePicture = null
}: DashboardInboxProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [selectMode, setSelectMode] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [shareImage, setShareImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [showGIFPicker, setShowGIFPicker] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({})
  
  // Social share states
  const [showSocialShareModal, setShowSocialShareModal] = useState(false)
  const [shareMessage, setShareMessage] = useState<Message | null>(null)
  const [shareLink, setShareLink] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // FIX: Handle undefined URL
  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    return `http://localhost:8000${url}`
  }

  const generateShareImage = async (message: Message) => {
    setSelectedMessage(message)
    setIsGenerating(true)
    
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const width = 500
      const height = 520
      canvas.width = width
      canvas.height = height
      
      if (!ctx) {
        throw new Error('Could not get canvas context')
      }
      
      const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        ctx.lineTo(x + w, y + h - r)
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        ctx.lineTo(x + r, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()
      }
      
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      
      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, brandColor)
      gradient.addColorStop(1, brandColor + 'dd')
      ctx.fillStyle = gradient
      roundRect(ctx, 0, 0, width, 80, 0)
      ctx.fill()
      
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      ctx.fillText('AnonMsg', width / 2, 35)
      
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.fillText('Anonymous Messaging Platform', width / 2, 60)
      
      const sectionY = 100
      ctx.fillStyle = '#F8FAFC'
      roundRect(ctx, 20, sectionY, width - 40, 55, 16)
      ctx.fill()
      
      ctx.fillStyle = '#94A3B8'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      ctx.fillText('Sent to', 35, sectionY + 8)
      
      ctx.fillStyle = '#0F172A'
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      ctx.fillText(`@${username}`, 35, sectionY + 28)
      
      const msgY = 180
      ctx.fillStyle = '#F1F5F9'
      roundRect(ctx, 20, msgY, width - 40, 200, 20)
      ctx.fill()
      
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      
      if (message.type === 'image' && message.media_url) {
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          const imageUrl = getFullImageUrl(message.media_url)
          
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = imageUrl
          })
          
          const maxImgWidth = width - 80
          const maxImgHeight = 160
          let imgWidth = img.width
          let imgHeight = img.height
          
          if (imgWidth > maxImgWidth) {
            const ratio = maxImgWidth / imgWidth
            imgWidth = maxImgWidth
            imgHeight = imgHeight * ratio
          }
          if (imgHeight > maxImgHeight) {
            const ratio = maxImgHeight / imgHeight
            imgHeight = maxImgHeight
            imgWidth = imgWidth * ratio
          }
          
          const imgX = (width - imgWidth) / 2
          const imgY = msgY + 10
          
          ctx.save()
          roundRect(ctx, imgX - 5, imgY - 5, imgWidth + 10, imgHeight + 10, 12)
          ctx.clip()
          ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight)
          ctx.restore()
          
          ctx.fillStyle = '#64748B'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          ctx.fillText('Shared Image', width / 2, imgY + imgHeight + 12)
          
        } catch (error) {
          ctx.fillStyle = '#E2E8F0'
          roundRect(ctx, 40, msgY + 20, width - 80, 120, 12)
          ctx.fill()
          ctx.fillStyle = '#94A3B8'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          ctx.fillText('📷 Image not available', width / 2, msgY + 80)
        }
      } else if (message.type === 'voice' && message.media_url) {
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.arc(55, msgY + 45, 20, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.moveTo(48, msgY + 35)
        ctx.lineTo(48, msgY + 55)
        ctx.lineTo(65, msgY + 45)
        ctx.closePath()
        ctx.fill()
        
        ctx.fillStyle = '#3b82f620'
        roundRect(ctx, 85, msgY + 40, 200, 8, 4)
        ctx.fill()
        
        ctx.fillStyle = '#3b82f6'
        roundRect(ctx, 85, msgY + 40, 90, 8, 4)
        ctx.fill()
        
        ctx.fillStyle = '#64748B'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        const duration = (message as any).media_duration || 30
        ctx.fillText(`${duration}s`, 295, msgY + 44)
        
        ctx.fillStyle = '#94A3B8'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        ctx.fillText('Voice Message', width / 2, msgY + 70)
      } else {
        const text = message.content || 'No message content'
        const maxWidth = width - 80
        const lineHeight = 25
        const maxLines = 6
        
        ctx.fillStyle = '#0F172A'
        ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        
        let lines = []
        let currentLine = ''
        let words = text.split(' ')
        
        for (let word of words) {
          const testLine = currentLine + word + ' '
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth && currentLine.length > 0) {
            lines.push(currentLine.trim())
            currentLine = word + ' '
          } else {
            currentLine = testLine
          }
        }
        lines.push(currentLine.trim())
        
        const displayLines = lines.slice(0, maxLines)
        displayLines.forEach((line, i) => {
          ctx.fillText(line, 40, msgY + 20 + (i * lineHeight))
        })
        
        if (lines.length > maxLines) {
          ctx.fillStyle = '#94A3B8'
          ctx.fillText('...', 40, msgY + 20 + (maxLines * lineHeight))
        }
      }
      
      const footerY = height - 50
      ctx.fillStyle = '#E2E8F0'
      ctx.fillRect(20, footerY, width - 40, 1)
      
      ctx.fillStyle = '#64748B'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      ctx.fillText('Anonymous Sender', 35, footerY + 20)
      
      ctx.fillStyle = brandColor
      ctx.textAlign = 'right'
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      ctx.fillText('AnonMsg', width - 35, footerY + 20)
      
      ctx.fillStyle = '#94A3B8'
      ctx.textAlign = 'center'
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      ctx.fillText('Font: Inter', width / 2, footerY + 42)
      
      const dataUrl = canvas.toDataURL('image/png')
      setShareImage(dataUrl)
      setShowShareModal(true)
      
    } catch (error) {
      console.error('Failed to generate image:', error)
      alert('Failed to generate share image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const openSocialShare = (message: Message) => {
    setShareMessage(message)
    const url = `${window.location.origin}/share/${message.id}`
    setShareLink(url)
    setShowSocialShareModal(true)
  }

  const shareToPlatform = (platform: string, url: string, text: string) => {
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
      discord: `https://discord.com/channels/@me`,
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.is_read
    if (filter === 'read') return m.is_read
    return true
  }).filter(m => {
    if (!searchQuery) return true
    return m.content?.toLowerCase().includes(searchQuery.toLowerCase()) || false
  })

  const toggleSelectMessage = (id: string) => {
    setSelectedMessages(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([])
    } else {
      setSelectedMessages(filteredMessages.map(m => String(m.id)))
    }
  }

  const archiveSelected = () => {
    selectedMessages.forEach(id => onArchive(id))
    setSelectedMessages([])
    setSelectMode(false)
  }

  const downloadImage = () => {
    if (shareImage) {
      const link = document.createElement('a')
      link.download = `anonmsg-to-${username}-${Date.now()}.png`
      link.href = shareImage
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const copyImage = async () => {
    if (!shareImage) return
    
    try {
      const response = await fetch(shareImage)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      downloadImage()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      if (onSendMessage) {
        onSendMessage('', 'image', { url: dataUrl, file })
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleVoiceRecord = (audioBlob: Blob, duration: number) => {
    if (onSendMessage) {
      const url = URL.createObjectURL(audioBlob)
      onSendMessage('', 'voice', { url, duration, blob: audioBlob })
    }
    setShowVoiceRecorder(false)
  }

  const handleGIFSelect = (url: string) => {
    if (onSendMessage) {
      onSendMessage('', 'gif', { url })
    }
    setShowGIFPicker(false)
  }

  const handleTemplateSelect = (text: string) => {
    setMessageInput(text)
    setShowTemplates(false)
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      if (onSendMessage) {
        onSendMessage(messageInput, 'text')
      }
      setMessageInput('')
    }
  }

  const playVoiceMessage = (id: string) => {
    const audio = audioElements[id]
    if (!audio) return

    if (playingVoice === id) {
      audio.pause()
      setPlayingVoice(null)
    } else {
      if (playingVoice) {
        const prevAudio = audioElements[playingVoice]
        if (prevAudio) prevAudio.pause()
      }
      audio.currentTime = 0
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error('Play error:', err)
          setPlayingVoice(null)
        })
      }
      setPlayingVoice(id)
    }
  }

  const themeClasses = {
    text: darkMode ? 'text-white' : 'text-slate-900',
    textSecondary: darkMode ? 'text-slate-400' : 'text-slate-500',
    card: darkMode ? 'bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl' : 'bg-white border border-slate-200/80 shadow-sm',
    hover: darkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50/80',
    button: darkMode ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm',
    input: darkMode ? 'bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20',
  }

  const statCards = [
    { icon: Inbox, value: stats.total, label: 'Total Messages', color: 'blue' },
    { icon: Eye, value: stats.unread, label: 'Unread', color: 'cyan' },
    { icon: Calendar, value: stats.thisWeek, label: 'This Week', color: 'emerald' },
    { icon: Award, value: `${stats.streak} days`, label: 'Streak', color: 'amber' },
    { icon: MessageSquare, value: stats.responseRate || 0, label: 'Engagement', color: 'indigo' },
  ]

  const getStatColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    }
    return colors[color] || 'bg-blue-500/10 text-blue-400'
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((stat, index) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`${themeClasses.card} rounded-2xl p-4 transition-all duration-200 hover:border-blue-500/40 hover:-translate-y-0.5`}
          >
            <div className={`inline-flex p-2.5 rounded-xl ${getStatColor(stat.color)} mb-2.5`}>
              <stat.icon size={16} />
            </div>
            <div className={`text-2xl font-extrabold tracking-tight ${themeClasses.text}`}>{stat.value}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                filter === f 
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : darkMode 
                    ? 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800' 
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'all' && ` (${messages.length})`}
              {f === 'unread' && ` (${messages.filter(m => !m.is_read).length})`}
              {f === 'read' && ` (${messages.filter(m => m.is_read).length})`}
            </button>
          ))}
        </div>
        
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${themeClasses.input} rounded-xl pl-10 pr-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
          />
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`px-4 py-2.5 rounded-xl transition-all text-sm font-medium flex items-center gap-2 ${themeClasses.button}`}
          >
            <MoreHorizontal size={16} />
            Actions
            <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
              >
                <div className="py-1">
                  <button onClick={onExport} className={`w-full px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-blue-500/10 transition ${themeClasses.text}`}>
                    <Download size={16} /> Export All
                  </button>
                  <button onClick={onMarkAllAsRead} className={`w-full px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-blue-500/10 transition ${themeClasses.text}`}>
                    <Eye size={16} /> Mark All Read
                  </button>
                  <button onClick={() => setSelectMode(!selectMode)} className={`w-full px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-blue-500/10 transition ${themeClasses.text}`}>
                    <Archive size={16} /> Bulk Archive
                  </button>
                  <button onClick={onShareLink} className={`w-full px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-blue-500/10 transition text-blue-500`}>
                    <Share2 size={16} /> Share Profile
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Composer */}
      {onSendMessage && (
        <div className={`${themeClasses.card} rounded-2xl border p-4`}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className={`flex-1 ${themeClasses.input} rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className={`p-2.5 rounded-xl transition ${themeClasses.button}`}
              title="Message Templates"
            >
              <Sparkles size={18} />
            </button>
            <button
              onClick={() => setShowGIFPicker(!showGIFPicker)}
              className={`p-2.5 rounded-xl transition ${themeClasses.button}`}
              title="GIF"
            >
              <ImageIcon size={18} />
            </button>
            <button
              onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
              className={`p-2.5 rounded-xl transition ${themeClasses.button}`}
              title="Voice Message"
            >
              <Mic size={18} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2.5 rounded-xl transition ${themeClasses.button}`}
              title="Upload Image"
            >
              <ImageIcon size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>

          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3"
              >
                <MessageTemplates
                  darkMode={darkMode}
                  onSelect={handleTemplateSelect}
                  onClose={() => setShowTemplates(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showGIFPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3"
              >
                <GIFPicker
                  darkMode={darkMode}
                  onSelect={handleGIFSelect}
                  onClose={() => setShowGIFPicker(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showVoiceRecorder && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3"
              >
                <VoiceRecorder
                  darkMode={darkMode}
                  onRecordComplete={handleVoiceRecord}
                  onCancel={() => setShowVoiceRecorder(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectMode && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-2xl flex items-center justify-between ${darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-gray-100/80 border border-gray-200'}`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-sm ${themeClasses.textSecondary}`}>
                {selectedMessages.length} selected
              </span>
              <button onClick={selectAll} className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline font-medium`}>
                {selectedMessages.length === filteredMessages.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={archiveSelected} className="px-4 py-2 rounded-xl text-sm flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition shadow-lg shadow-blue-500/25 font-semibold">
                <Archive size={14} /> Archive ({selectedMessages.length})
              </button>
              <button onClick={() => { setSelectMode(false); setSelectedMessages([]) }} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'} transition font-medium`}>
                Cancel
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
            className={`${darkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-slate-50/50 border-slate-200'} rounded-2xl p-16 text-center border-2 border-dashed`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 flex items-center justify-center">
              <Inbox className="w-8 h-8 text-blue-500/80" />
            </div>
            <h3 className={`text-lg font-bold ${themeClasses.text} mb-2`}>Empty inbox</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {searchQuery ? 'Try a different search term' : 'Share your link to receive anonymous messages'}
            </p>
            {!searchQuery && (
              <button onClick={onShareLink} className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 active:scale-95">
                <Share2 size={14} className="inline mr-2" /> Share Your Link
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-2">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`${themeClasses.card} rounded-2xl p-4 transition-all duration-200 hover:shadow-md ${!message.is_read ? (darkMode ? 'border-l-4 border-l-blue-500 bg-blue-500/5' : 'border-l-4 border-l-blue-500 bg-blue-50/30') : ''}`}
              >
                <div className="flex items-start gap-3">
                  {selectMode && (
                    <input 
                      type="checkbox" 
                      checked={selectedMessages.includes(String(message.id))} 
                      onChange={() => toggleSelectMessage(String(message.id))} 
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" 
                    />
                  )}
                  
                  {!message.is_read && (
                    <div className="mt-1.5">
                      <Circle size={10} className="text-blue-500 fill-blue-500" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <MessageSquare size={14} className={`${!message.is_read ? 'text-blue-500' : 'text-gray-400'} mt-0.5 shrink-0`} />
                      
                      {message.type === 'voice' && message.media_url && (
                        <div className="flex items-center gap-3 flex-1">
                          <button 
                            onClick={() => playVoiceMessage(String(message.id))}
                            className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                          >
                            {playingVoice === String(message.id) ? <Pause size={14} /> : <Play size={14} />}
                          </button>
                          <div className="flex-1 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: playingVoice === String(message.id) ? '65%' : '45%' }} />
                          </div>
                          <span className="text-xs text-gray-500">{(message as any).media_duration || 30}s</span>
                          <audio 
                            ref={(el) => {
                              if (el) {
                                setAudioElements(prev => ({ ...prev, [String(message.id)]: el }))
                              }
                            }}
                            src={message.media_url}
                            onEnded={() => setPlayingVoice(null)}
                            className="hidden"
                          />
                        </div>
                      )}
                      
                      {message.type === 'image' && message.media_url && (
                        <div className="relative group">
                          <img 
                            src={getFullImageUrl(message.media_url)} 
                            alt="Shared image" 
                            className="rounded-xl max-h-[120px] object-cover cursor-pointer"
                            onClick={() => {
                              // FIX: Check if media_url exists before opening
                              if (message.media_url) {
                                window.open(getFullImageUrl(message.media_url), '_blank')
                              }
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              const parent = e.currentTarget.parentElement
                              if (parent) {
                                const fallback = document.createElement('div')
                                fallback.className = 'flex items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 text-sm'
                                fallback.innerHTML = `
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <polyline points="21 15 16 10 5 21"/>
                                  </svg>
                                  <span>Image not available</span>
                                `
                                parent.appendChild(fallback)
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl">
                            <span className="text-white text-xs">Click to view</span>
                          </div>
                        </div>
                      )}
                      
                      {message.type === 'text' && (
                        <p className={`${!message.is_read ? themeClasses.text : themeClasses.textSecondary} text-sm leading-relaxed break-words`}>
                          {message.content || ''}
                        </p>
                      )}
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
                      {message.type && message.type !== 'text' && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-500 rounded-full text-[10px] font-medium">
                          {message.type}
                        </span>
                      )}
                      {!message.is_read && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-500 rounded-full text-[10px] font-medium">New</span>
                      )}
                      {message.is_pinned && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-full text-[10px] font-medium flex items-center gap-1">
                          <Pin size={10} /> Pinned
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 shrink-0">
                    {!message.is_read && (
                      <button 
                        onClick={() => onMarkAsRead(String(message.id))} 
                        className={`p-1.5 rounded-xl transition ${themeClasses.hover}`}
                        title="Mark as read"
                      >
                        <Eye size={14} className="text-gray-500" />
                      </button>
                    )}
                    {onPinMessage && (
                      <button 
                        onClick={() => onPinMessage(String(message.id))} 
                        className={`p-1.5 rounded-xl transition ${themeClasses.hover}`}
                        title={message.is_pinned ? 'Unpin' : 'Pin'}
                      >
                        {message.is_pinned ? <PinOff size={14} className="text-yellow-500" /> : <Pin size={14} className="text-gray-500" />}
                      </button>
                    )}
                    <button 
                      onClick={() => generateShareImage(message)} 
                      className={`p-1.5 rounded-xl transition ${themeClasses.hover}`} 
                      disabled={isGenerating}
                      title="Share as image"
                    >
                      {isGenerating && selectedMessage?.id === message.id ? (
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Share2 size={14} className="text-gray-500" />
                      )}
                    </button>
                    <button 
                      onClick={() => openSocialShare(message)} 
                      className={`p-1.5 rounded-xl transition ${themeClasses.hover}`}
                      title="Share"
                    >
                      <Share2 size={14} className="text-gray-500" />
                    </button>
                    <button 
                      onClick={() => onReport(message)} 
                      className={`p-1.5 rounded-xl transition ${themeClasses.hover}`}
                      title="Report"
                    >
                      <Flag size={14} className="text-gray-500" />
                    </button>
                    <button 
                      onClick={() => onArchive(String(message.id))} 
                      className={`p-1.5 rounded-xl transition ${themeClasses.hover}`}
                      title="Archive"
                    >
                      <Archive size={14} className="text-gray-500" />
                    </button>
                    <button 
                      onClick={() => onDelete(String(message.id))} 
                      className={`p-1.5 rounded-xl transition hover:bg-red-500/10`}
                      title="Delete"
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

      {/* Social Share Modal */}
      <AnimatePresence>
        {showSocialShareModal && shareMessage && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSocialShareModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-2xl w-full max-w-md p-6 shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Share Message</h3>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>Share this anonymous message</p>
                </div>
                <button onClick={() => setShowSocialShareModal(false)} className={`p-1.5 rounded-xl ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}>
                  <X size={20} className={themeClasses.textSecondary} />
                </button>
              </div>
              
              <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <p className={`text-sm ${themeClasses.text} line-clamp-2`}>
                  {shareMessage.content || 'Anonymous message'}
                </p>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className={`flex-1 ${themeClasses.input} rounded-xl px-3 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                <button
                  onClick={copyShareLink}
                  className={`p-2 rounded-xl transition ${themeClasses.button}`}
                >
                  {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => shareToPlatform('twitter', shareLink, shareMessage.content || 'Anonymous message')}
                  className="p-3 rounded-xl bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white transition flex flex-col items-center gap-1"
                >
                  <FaTwitter size={20} />
                  <span className="text-[10px]">Twitter</span>
                </button>
                <button
                  onClick={() => shareToPlatform('facebook', shareLink, shareMessage.content || 'Anonymous message')}
                  className="p-3 rounded-xl bg-[#1877F2] hover:bg-[#1664d9] text-white transition flex flex-col items-center gap-1"
                >
                  <FaFacebook size={20} />
                  <span className="text-[10px]">Facebook</span>
                </button>
                <button
                  onClick={() => shareToPlatform('whatsapp', shareLink, shareMessage.content || 'Anonymous message')}
                  className="p-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white transition flex flex-col items-center gap-1"
                >
                  <FaWhatsapp size={20} />
                  <span className="text-[10px]">WhatsApp</span>
                </button>
                <button
                  onClick={() => shareToPlatform('telegram', shareLink, shareMessage.content || 'Anonymous message')}
                  className="p-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white transition flex flex-col items-center gap-1"
                >
                  <FaTelegram size={20} />
                  <span className="text-[10px]">Telegram</span>
                </button>
                <button
                  onClick={() => shareToPlatform('linkedin', shareLink, shareMessage.content || 'Anonymous message')}
                  className="p-3 rounded-xl bg-[#0A66C2] hover:bg-[#0958a8] text-white transition flex flex-col items-center gap-1"
                >
                  <FaLinkedin size={20} />
                  <span className="text-[10px]">LinkedIn</span>
                </button>
                <button
                  onClick={() => shareToPlatform('reddit', shareLink, shareMessage.content || 'Anonymous message')}
                  className="p-3 rounded-xl bg-[#FF4500] hover:bg-[#e63e00] text-white transition flex flex-col items-center gap-1"
                >
                  <FaReddit size={20} />
                  <span className="text-[10px]">Reddit</span>
                </button>
                <button
                  onClick={() => shareToPlatform('pinterest', shareLink, shareMessage.content || 'Anonymous message')}
                  className="p-3 rounded-xl bg-[#E60023] hover:bg-[#cc001f] text-white transition flex flex-col items-center gap-1"
                >
                  <FaPinterest size={20} />
                  <span className="text-[10px]">Pinterest</span>
                </button>
                <button
                  onClick={() => shareToPlatform('discord', shareLink, shareMessage.content || 'Anonymous message')}
                  className="p-3 rounded-xl bg-[#5865F2] hover:bg-[#4e5bd9] text-white transition flex flex-col items-center gap-1"
                >
                  <FaDiscord size={20} />
                  <span className="text-[10px]">Discord</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Image Modal */}
      <AnimatePresence>
        {showShareModal && shareImage && selectedMessage && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-2xl w-full max-w-md p-6 shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Share Branded Image</h3>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>Share this message as a beautiful image</p>
                </div>
                <button onClick={() => setShowShareModal(false)} className={`p-1.5 rounded-xl ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}>
                  <X size={20} className={themeClasses.textSecondary} />
                </button>
              </div>
              
              {shareImage && (
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-4 shadow-lg">
                  <img src={shareImage} alt="Branded message" className="w-full" />
                </div>
              )}
              
              <div className="space-y-2">
                <button 
                  onClick={downloadImage} 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white text-sm font-semibold transition shadow-lg shadow-blue-500/25 active:scale-95"
                >
                  <Download size={16} /> Download Image
                </button>
                <button 
                  onClick={copyImage} 
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition ${themeClasses.button}`}
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <LinkIcon size={16} />}
                  {copied ? 'Copied!' : 'Copy Image'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}