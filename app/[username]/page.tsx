// app/[username]/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { messagesAPI, profileAPI } from '@/lib/api'
import { useTheme } from '@/app/context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

// Lucide React Icons
import { 
  Send, Shield, Lock, User, Calendar, MessageSquare,
  Check, AlertCircle, Copy, Eye, Heart, Users, Star,
  Globe, Link as LinkIcon, MapPin, Mail, Sparkles, AlertTriangle,
  X, Menu, ArrowLeft, Home, LogOut, Settings, Bell, Inbox, Share2, Zap, Clock,
  Mic, Image as ImageIcon, Smile, Paperclip, Loader2, Trash2,
  Play, Pause, Volume2, VolumeX, Gift
} from 'lucide-react'

// React Icons for Social Media
import { 
  FaTwitter, FaInstagram, FaYoutube, FaGithub, FaDiscord, FaTiktok 
} from 'react-icons/fa'
import { FiLink } from 'react-icons/fi'

// Components
import { VoiceRecorder } from '@/app/components/VoiceRecorder'
import { GIFPicker } from '@/app/components/GIFPicker'
import { GiftModal } from '@/app/components/GiftModal'
import { LeaderboardWidget } from '@/app/components/LeaderboardWidget'

// Button Component with theme support
const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, fullWidth, disabled, loading, type = 'button', darkMode = false }: any) => {
  const baseStyles = "font-medium transition-colors duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 rounded-xl"
  
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm",
    secondary: darkMode
      ? "bg-slate-900 hover:bg-slate-800 text-white border border-slate-800"
      : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-500/10",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-sm",
  }
  
  const sizes: any = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}

// Social Link Component with theme
const SocialLink = ({ href, icon: Icon, label, darkMode }: { href: string | null, icon: any, label: string, darkMode: boolean }) => {
  if (!href) return null
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2.5 rounded-xl transition-all duration-200 group ${
        darkMode 
          ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
          : 'bg-gray-100 hover:bg-gray-200 border border-gray-200/50'
      }`}
      title={label}
    >
      <Icon size={18} className={`transition-colors duration-200 ${
        darkMode 
          ? 'text-gray-400 group-hover:text-white' 
          : 'text-gray-600 group-hover:text-gray-900'
      }`} />
    </motion.a>
  )
}

interface PublicProfile {
  username: string
  bio: string
  profile_picture: string | null
  banner_image: string | null
  team_color: string
  twitter: string | null
  instagram: string | null
  youtube: string | null
  tiktok: string | null
  github: string | null
  website: string | null
  discord: string | null
  message_count: number
  join_date: string
  allow_gifting?: boolean
  minimum_gift_amount?: number
  currency?: string
  public_wall?: boolean
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { darkMode } = useTheme()
  const username = params.username as string
  
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [characterCount, setCharacterCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showGiftModal, setShowGiftModal] = useState(false)
  
  // Media states
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [showGIFPicker, setShowGIFPicker] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [messageType, setMessageType] = useState<'text' | 'voice' | 'image' | 'gif'>('text')
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [voiceDuration, setVoiceDuration] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const maxChars = 1000

  // Social links configuration
  const socialLinks = [
    { key: 'twitter', icon: FaTwitter, label: 'Twitter' },
    { key: 'instagram', icon: FaInstagram, label: 'Instagram' },
    { key: 'youtube', icon: FaYoutube, label: 'YouTube' },
    { key: 'tiktok', icon: FaTiktok, label: 'TikTok' },
    { key: 'github', icon: FaGithub, label: 'GitHub' },
    { key: 'website', icon: FiLink, label: 'Website' },
    { key: 'discord', icon: FaDiscord, label: 'Discord' },
  ]

  useEffect(() => {
    // Get current logged-in user
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setCurrentUser(user.username)
      } catch (e) {
        console.error('Failed to parse user:', e)
      }
    }
    
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getPublicProfile(username)
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        setError('User not found')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [username])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setSelectedFile(file)
    setMessageType('image')
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleVoiceRecord = (blob: Blob, duration: number) => {
    setVoiceBlob(blob)
    setVoiceDuration(duration)
    setMessageType('voice')
    setShowVoiceRecorder(false)
  }

  const handleGIFSelect = (url: string) => {
    setMessageType('gif')
    // GIF will be sent as a URL
    setMessage(url)
    setShowGIFPicker(false)
  }

  const clearMedia = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setVoiceBlob(null)
    setVoiceDuration(0)
    setMessageType('text')
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent sending message to yourself
    if (currentUser === username) {
      setError("You cannot send a message to yourself")
      return
    }
    
    // Validate based on message type
    if (messageType === 'text' && (!message.trim() || message.length < 3)) {
      setError("Please enter a message (at least 3 characters)")
      return
    }
    
    if (messageType === 'voice' && !voiceBlob) {
      setError("Please record a voice message")
      return
    }
    
    if (messageType === 'image' && !selectedFile) {
      setError("Please select an image")
      return
    }
    
    if (messageType === 'gif' && !message) {
      setError("Please select a GIF")
      return
    }
    
    setIsSending(true)
    setError('')
    
    try {
      let response;
      
      if (messageType === 'voice' && voiceBlob) {
        // Send voice message
        const formData = new FormData()
        formData.append('recipient_username', username)
        formData.append('message_type', 'voice')
        formData.append('voice_file', voiceBlob, 'voice.webm')
        formData.append('duration', voiceDuration.toString())
        
        response = await messagesAPI.sendVoiceMessage(formData)
      } else if (messageType === 'image' && selectedFile) {
        // Send image message
        const formData = new FormData()
        formData.append('recipient_username', username)
        formData.append('message_type', 'image')
        formData.append('image_file', selectedFile)
        
        response = await messagesAPI.sendImageMessage(formData)
      } else if (messageType === 'gif') {
        // Send GIF message
        response = await messagesAPI.sendMessage({
          recipient_username: username,
          content: message,
          message_type: 'gif'
        })
      } else {
        // Send text message
        response = await messagesAPI.sendMessage({
          recipient_username: username,
          content: message,
          message_type: 'text'
        })
      }
      
      if (response && response.ok) {
        setSent(true)
        setMessage('')
        setCharacterCount(0)
        clearMedia()
        setTimeout(() => setSent(false), 3000)
      } else {
        const errorData = await response?.json()
        setError(errorData?.error || 'Failed to send message')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleMessageChange = (text: string) => {
    if (text.length <= maxChars) {
      setMessage(text)
      setCharacterCount(text.length)
      if (text && messageType === 'gif') {
        setMessageType('text')
      }
    }
  }

  const copyProfileLink = () => {
    const link = window.location.href
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isOwnProfile = currentUser === username

  const themeClasses = {
    bg: darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50',
    text: darkMode ? 'text-white' : 'text-slate-900',
    textSecondary: darkMode ? 'text-slate-400' : 'text-slate-500',
    textMuted: darkMode ? 'text-slate-500' : 'text-slate-400',
    card: darkMode ? 'bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl' : 'bg-white border border-slate-200/80 shadow-sm',
    cardHover: darkMode ? 'hover:border-blue-500/40' : 'hover:border-blue-500/40',
    input: darkMode ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20',
    buttonSecondary: darkMode ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60',
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className={themeClasses.textSecondary}>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <User size={40} className="text-gray-500" />
          </div>
          <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>User not found</h1>
          <p className={themeClasses.textSecondary}>The profile you're looking for doesn't exist.</p>
          <Link href="/">
            <Button variant="secondary" darkMode={darkMode} className="mt-6">
              <ArrowLeft size={16} /> Return Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const firstChar = profile.username ? profile.username.charAt(0).toUpperCase() : '?'
  const activeSocialLinks = socialLinks.filter(link => profile[link.key as keyof PublicProfile])

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      {/* Banner Section */}
      <div className="relative h-40 sm:h-56 w-full overflow-hidden">
        {profile.banner_image ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.banner_image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </>
        ) : (
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: profile.team_color || (darkMode ? '#0f172a' : '#f1f5f9')
            }}
          />
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-end gap-4"
          >
            {/* Avatar */}
            <div className="relative group">
              {profile.profile_picture ? (
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-black dark:border-white/10 shadow-2xl">
                  <img 
                    src={profile.profile_picture} 
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-28 h-28 rounded-2xl flex items-center justify-center border-4 border-black dark:border-white/10 shadow-2xl"
                  style={{ backgroundColor: profile.team_color || '#3B82F6' }}
                >
                  <span className="text-4xl font-bold text-white">{firstChar}</span>
                </div>
              )}
              <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1.5 shadow-sm">
                <Shield size={12} className="text-white" />
              </div>
              {isOwnProfile && (
                <div className="absolute -bottom-2 -left-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">
                  You
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
                  @{profile.username}
                </h1>
                <button
                  onClick={copyProfileLink}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    darkMode ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-gray-100 hover:bg-gray-200 border border-gray-200/50'
                  }`}
                  title="Copy profile link"
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className={themeClasses.textSecondary} />
                  )}
                </button>
                {!isOwnProfile && profile.allow_gifting !== false && (
                  <button
                    type="button"
                    onClick={() => setShowGiftModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Gift size={14} />
                    <span>Send Tip</span>
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <MessageSquare size={14} className="text-blue-500" />
                  </div>
                  <span className={`text-sm font-medium ${themeClasses.text}`}>{profile.message_count || 0}</span>
                  <span className={`text-xs ${themeClasses.textSecondary}`}>messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10">
                    <Calendar size={14} className="text-indigo-400" />
                  </div>
                  <span className={`text-xs ${themeClasses.textSecondary}`}>
                    Joined {profile.join_date ? new Date(profile.join_date).getFullYear() : 'recently'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-500/10">
                    <Zap size={14} className="text-green-500" />
                  </div>
                  <span className={`text-xs ${themeClasses.textSecondary}`}>
                    {profile.message_count > 0 ? 'Active' : 'New'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          {profile.bio && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`mt-4 p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200/60'}`}
            >
              <p className={`text-sm ${themeClasses.textSecondary} leading-relaxed`}>
                {profile.bio}
              </p>
            </motion.div>
          )}

          {/* Social Links */}
          {activeSocialLinks.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {activeSocialLinks.map((link) => {
                const Icon = link.icon
                const url = profile[link.key as keyof PublicProfile]
                if (!url) return null
                return (
                  <SocialLink 
                    key={link.key}
                    href={url as string}
                    icon={Icon}
                    label={link.label}
                    darkMode={darkMode}
                  />
                )
              })}
            </motion.div>
          )}
        </div>

        {/* Message Form - Hidden if viewing own profile */}
        {!isOwnProfile ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border p-6 ${themeClasses.card} ${themeClasses.cardHover} transition-all duration-300`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-blue-500" />
              <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Send Anonymous Message</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Message Input */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                  Your message to @{profile.username}
                </label>
                <div className="relative">
                  <textarea
                    className={`w-full ${themeClasses.input} rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition resize-none border`}
                    rows={4}
                    placeholder={messageType === 'gif' ? 'GIF selected!' : `Write your anonymous message...`}
                    value={message}
                    onChange={(e) => handleMessageChange(e.target.value)}
                    maxLength={maxChars}
                    disabled={messageType === 'voice' || messageType === 'image' || messageType === 'gif'}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {characterCount}/{maxChars}
                  </div>
                </div>
              </div>

              {/* Media Preview */}
              <AnimatePresence>
                {messageType === 'voice' && voiceBlob && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3"
                  >
                    <Mic size={18} className="text-blue-500" />
                    <span className={`text-sm ${themeClasses.text}`}>Voice message ready</span>
                    <span className="text-xs text-gray-500">{voiceDuration}s</span>
                    <button onClick={clearMedia} className="ml-auto p-1 hover:bg-red-500/10 rounded-lg">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </motion.div>
                )}
                
                {messageType === 'image' && imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative p-2 bg-gray-100 dark:bg-gray-800 rounded-xl"
                  >
                    <img src={imagePreview} alt="Preview" className="max-h-[150px] rounded-lg object-contain" />
                    <button onClick={clearMedia} className="absolute top-3 right-3 p-1 bg-black/50 hover:bg-black/70 rounded-lg">
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Media Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                  className={`p-2 rounded-xl transition ${themeClasses.buttonSecondary}`}
                  title="Record voice message"
                >
                  <Mic size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-xl transition ${themeClasses.buttonSecondary}`}
                  title="Upload image"
                >
                  <ImageIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowGIFPicker(!showGIFPicker)}
                  className={`p-2 rounded-xl transition ${themeClasses.buttonSecondary}`}
                  title="Add GIF"
                >
                  <Smile size={18} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Voice Recorder */}
              <AnimatePresence>
                {showVoiceRecorder && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <VoiceRecorder
                      darkMode={darkMode}
                      onRecordComplete={handleVoiceRecord}
                      onCancel={() => setShowVoiceRecorder(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* GIF Picker */}
              <AnimatePresence>
                {showGIFPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <GIFPicker
                      darkMode={darkMode}
                      onSelect={handleGIFSelect}
                      onClose={() => setShowGIFPicker(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield size={12} className="text-green-500" />
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock size={12} className="text-blue-500" />
                  <span>End-to-end encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Eye size={12} className="text-cyan-400" />
                  <span>No tracking</span>
                </div>
              </div>

              {/* Errors & Success */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm flex items-center gap-2"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {sent && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-500 text-sm flex items-center gap-2"
                  >
                    <Check size={16} />
                    Message sent anonymously!
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                fullWidth 
                loading={isSending}
                disabled={
                  (messageType === 'text' && (!message.trim() || message.length < 3)) ||
                  (messageType === 'voice' && !voiceBlob) ||
                  (messageType === 'image' && !selectedFile) ||
                  (messageType === 'gif' && !message)
                }
                darkMode={darkMode}
                size="lg"
              >
                {isSending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    {messageType === 'voice' && <Mic size={16} />}
                    {messageType === 'image' && <ImageIcon size={16} />}
                    {messageType === 'gif' && <Smile size={16} />}
                    {messageType === 'text' && <Send size={16} />}
                    Send Anonymous {messageType === 'voice' ? 'Voice' : messageType === 'image' ? 'Image' : messageType === 'gif' ? 'GIF' : 'Message'}
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          // Message when viewing own profile
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border p-8 text-center ${themeClasses.card}`}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <User size={36} className="text-blue-500" />
            </div>
            <h3 className={`text-xl font-semibold ${themeClasses.text} mb-2`}>This is your profile</h3>
            <p className={`text-sm ${themeClasses.textSecondary} mb-6 max-w-md mx-auto`}>
              You cannot send messages to yourself. Share your profile link with others to receive anonymous messages.
            </p>
            <button
              onClick={copyProfileLink}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto ${
                darkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
              }`}
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Profile Link
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Top Supporters Leaderboard */}
        {profile.allow_gifting !== false && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-8"
          >
            <LeaderboardWidget 
              username={username}
              onOpenGiftModal={() => setShowGiftModal(true)}
              darkMode={darkMode}
            />
          </motion.div>
        )}

        {/* Gift Modal */}
        <GiftModal
          isOpen={showGiftModal}
          onClose={() => setShowGiftModal(false)}
          creatorUsername={username}
          creatorAvatar={profile.profile_picture}
          darkMode={darkMode}
        />

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className={`text-xs ${themeClasses.textMuted}`}>
            Your identity is never stored. Messages are encrypted and anonymous.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className={`text-xs ${themeClasses.textMuted} hover:${darkMode ? 'text-gray-400' : 'text-gray-600'} transition`}>
              Privacy
            </Link>
            <Link href="/terms" className={`text-xs ${themeClasses.textMuted} hover:${darkMode ? 'text-gray-400' : 'text-gray-600'} transition`}>
              Terms
            </Link>
            <Link href="/about" className={`text-xs ${themeClasses.textMuted} hover:${darkMode ? 'text-gray-400' : 'text-gray-600'} transition`}>
              About
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}