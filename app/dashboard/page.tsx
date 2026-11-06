// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/context/ThemeContext'
import Link from 'next/link'
import { 
  Menu, X, AlertCircle, Loader2, Check,
  MessageSquare, Plus, Share2, Trash2, BarChart3, Archive, Settings, LogOut, Sun, Moon,
  Copy, Wallet, Sparkles
} from 'lucide-react'

// Import components
import { DashboardSidebar } from './components/DashboardSidebar'
import { DashboardBottomNav } from './components/DashboardBottomNav'
import { DashboardInbox } from './components/DashboardInbox'
import { DashboardAnalytics } from './components/DashboardAnalytics'
import { DashboardArchive } from './components/DashboardArchive'
import { DashboardSettings } from './components/DashboardSettings'
import { DashboardWallet } from './components/DashboardWallet'
import DashboardQAPage from './qa/page'

// Import API client
import { profileAPI, messagesAPI, API_BASE_URL } from '@/lib/api'

// Import PWA hook
import { usePWA } from '@/hooks/usePWA'

// IMPORT THE TYPES FROM THE TYPES FILE
import { Message, SettingsForm } from './types'

export default function DashboardPage() {
  const router = useRouter()
  const { darkMode, toggleTheme } = useTheme()
  const { isPWA, showInstallPrompt, installApp, dismissPrompt, isInstalling } = usePWA()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'profile' | 'banner' | null>(null)
  const [showSavedAlert, setShowSavedAlert] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'inbox' | 'analytics' | 'settings' | 'archive' | 'qa' | 'wallet'>('inbox')
  const [messages, setMessages] = useState<Message[]>([])
  const [archivedMessages, setArchivedMessages] = useState<Message[]>([])
  const [settings, setSettings] = useState<SettingsForm>({
    username: '',
    email: '',
    bio: '',
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    publicWall: true,
    allowVoice: true,
    autoDelete: false,
    profilePicture: null,
    bannerImage: null,
    teamColor: '#3B82F6',
    socialLinks: {
      twitter: '',
      instagram: '',
      youtube: '',
      tiktok: '',
      github: '',
      website: '',
      discord: ''
    }
  })
  const [stats, setStats] = useState({
    total: 0, 
    unread: 0, 
    thisWeek: 0, 
    streak: 0,
    responseRate: 0,
    avg_response_time: '2.4h',
    top_reaction: '🔥'
  })

  // Image upload handlers
  const handleImageUpload = async (type: 'profile' | 'banner', file: File) => {
    setUploading(type)
    const formData = new FormData()
    formData.append(type === 'profile' ? 'profile_picture' : 'banner_image', file)
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        if (type === 'profile') {
          setSettings(prev => ({ ...prev, profilePicture: data.profile_picture }))
        } else {
          setSettings(prev => ({ ...prev, bannerImage: data.banner_image }))
        }
      } else {
        alert(`Failed to upload ${type} image`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Network error. Please try again.')
    } finally {
      setUploading(null)
    }
  }

  const handleImageRemove = async (type: 'profile' | 'banner') => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [type === 'profile' ? 'profile_picture' : 'banner_image']: null
        }),
      })
      
      if (response.ok) {
        if (type === 'profile') {
          setSettings(prev => ({ ...prev, profilePicture: null }))
        } else {
          setSettings(prev => ({ ...prev, bannerImage: null }))
        }
      }
    } catch (error) {
      console.error('Remove failed:', error)
      alert('Failed to remove image')
    }
  }

  // Save settings
  const saveSettings = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('access_token')
      
      const userResponse = await fetch(`${API_BASE_URL}/auth/me/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: settings.username,
          email: settings.email,
        }),
      })
      
      if (!userResponse.ok) {
        const errorData = await userResponse.json()
        throw new Error(errorData.error || 'Failed to update account')
      }
      
      const profileResponse = await fetch(`${API_BASE_URL}/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: settings.bio,
          team_color: settings.teamColor,
          public_wall: settings.publicWall,
          allow_voice: settings.allowVoice,
          auto_delete: settings.autoDelete,
          twitter: settings.socialLinks.twitter,
          instagram: settings.socialLinks.instagram,
          youtube: settings.socialLinks.youtube,
          tiktok: settings.socialLinks.tiktok,
          github: settings.socialLinks.github,
          website: settings.socialLinks.website,
          discord: settings.socialLinks.discord,
        }),
      })
      
      if (profileResponse.ok) {
        setShowSavedAlert(true)
        setTimeout(() => setShowSavedAlert(false), 3000)
      } else {
        throw new Error('Failed to save profile settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert(error instanceof Error ? error.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login')
        return
      }
      
      try {
        const profileRes = await profileAPI.getProfile()
        const profileData = await profileRes.json()
        
        setSettings({
          username: profileData.username || '',
          email: profileData.email || '',
          bio: profileData.bio || '',
          emailNotifications: profileData.email_notifications !== undefined ? profileData.email_notifications : true,
          pushNotifications: profileData.push_notifications !== undefined ? profileData.push_notifications : true,
          weeklyDigest: profileData.weekly_digest !== undefined ? profileData.weekly_digest : false,
          publicWall: profileData.public_wall !== undefined ? profileData.public_wall : true,
          allowVoice: profileData.allow_voice !== undefined ? profileData.allow_voice : true,
          autoDelete: profileData.auto_delete !== undefined ? profileData.auto_delete : false,
          profilePicture: profileData.profile_picture || null,
          bannerImage: profileData.banner_image || null,
          teamColor: profileData.team_color || '#3B82F6',
          socialLinks: {
            twitter: profileData.twitter || '',
            instagram: profileData.instagram || '',
            youtube: profileData.youtube || '',
            tiktok: profileData.tiktok || '',
            github: profileData.github || '',
            website: profileData.website || '',
            discord: profileData.discord || ''
          }
        })
        
        const messagesRes = await messagesAPI.getInbox()
        const messagesData = await messagesRes.json()
        const fetchedMessages = messagesData.results || []
        setMessages(fetchedMessages.filter((m: Message) => !m.is_archived))
        setArchivedMessages(fetchedMessages.filter((m: Message) => m.is_archived))
        
        const total = fetchedMessages.filter((m: Message) => !m.is_archived).length
        const unread = fetchedMessages.filter((m: Message) => !m.is_archived && !m.is_read).length
        
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        const thisWeek = fetchedMessages.filter((m: Message) => new Date(m.created_at) >= oneWeekAgo && !m.is_archived).length
        
        const dates: string[] = fetchedMessages
          .filter((m: Message) => !m.is_archived)
          .map((m: Message) => new Date(m.created_at).toDateString())
        const uniqueDates: string[] = [...new Set(dates)].sort()
        let streak = 0
        let currentStreak = 0
        let lastDate: Date | null = null
        
        for (const dateStr of uniqueDates) {
          const currentDate = new Date(dateStr)
          if (lastDate) {
            const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
            if (diffDays === 1) {
              currentStreak++
            } else if (diffDays > 1) {
              currentStreak = 1
            }
          } else {
            currentStreak = 1
          }
          streak = Math.max(streak, currentStreak)
          lastDate = currentDate
        }
        
        const read = fetchedMessages.filter((m: Message) => !m.is_archived && m.is_read).length
        const responseRate = total > 0 ? Math.round((read / total) * 100) : 0
        
        setStats({
          total,
          unread,
          thisWeek,
          streak,
          responseRate,
          avg_response_time: '2.4h',
          top_reaction: '🔥'
        })
        
      } catch (error) {
        console.error('Failed to fetch:', error)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const shareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${settings.username}`)
    alert('Profile link copied!')
  }

  // ============ HANDLERS FOR DASHBOARD INBOX (expect string IDs) ============
  
  const deleteMessage = async (id: string) => {
    const numId = parseInt(id)
    const response = await messagesAPI.deleteMessage(id)
    if (response.ok) {
      setMessages(messages.filter(m => m.id !== numId))
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        unread: messages.find(m => m.id === numId && !m.is_read) ? prev.unread - 1 : prev.unread
      }))
    }
  }

  const archiveMessage = async (id: string) => {
    const numId = parseInt(id)
    const response = await messagesAPI.archiveMessage(id)
    if (response.ok) {
      const archivedMsg = messages.find(m => m.id === numId)
      setMessages(messages.filter(m => m.id !== numId))
      if (archivedMsg) {
        setArchivedMessages([{ ...archivedMsg, is_archived: true }, ...archivedMessages])
      }
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        unread: messages.find(m => m.id === numId && !m.is_read) ? prev.unread - 1 : prev.unread
      }))
    }
  }

  const markAsRead = async (id: string) => {
    const numId = parseInt(id)
    const response = await messagesAPI.markAsRead(id)
    if (response.ok) {
      setMessages(messages.map(m => m.id === numId ? { ...m, is_read: true } : m))
      setStats(prev => ({ ...prev, unread: prev.unread - 1 }))
    }
  }

  const markAllAsRead = async () => {
    for (const message of messages.filter(m => !m.is_read)) {
      await markAsRead(String(message.id))
    }
  }

  // ============ HANDLERS FOR DASHBOARD ARCHIVE (expect number IDs) ============
  
  const restoreMessage = async (id: number) => {
    const response = await messagesAPI.restoreMessage(String(id))
    if (response.ok) {
      const restoredMsg = archivedMessages.find(m => m.id === id)
      setArchivedMessages(archivedMessages.filter(m => m.id !== id))
      if (restoredMsg) {
        setMessages([{ ...restoredMsg, is_archived: false }, ...messages])
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          unread: restoredMsg.is_read ? prev.unread : prev.unread + 1
        }))
      }
    }
  }

  const permanentDeleteMessage = async (id: number) => {
    if (confirm('Permanently delete this message? This cannot be undone.')) {
      const response = await messagesAPI.permanentDelete(String(id))
      if (response.ok) {
        setArchivedMessages(archivedMessages.filter(m => m.id !== id))
      }
    }
  }

  const markArchivedAsRead = async (id: number) => {
    const response = await messagesAPI.markAsRead(String(id))
    if (response.ok) {
      setArchivedMessages(archivedMessages.map(m => m.id === id ? { ...m, is_read: true } : m))
    }
  }

  const exportMessages = () => {
    const data = JSON.stringify(messages, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `messages-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateShareImage = (message: Message) => {
    // Handled in DashboardInbox component
  }

  const handleReport = (message: Message) => {
    alert(`Reported: "${message.content.substring(0, 50)}..."`)
  }

  const themeClasses = {
    bg: darkMode ? 'bg-black' : 'bg-gray-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSec: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: darkMode ? 'border-white/10' : 'border-gray-200/50',
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inbox':
        return (
          <DashboardInbox 
            messages={messages}
            stats={stats}
            darkMode={darkMode}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDelete={deleteMessage}
            onArchive={archiveMessage}
            onExport={exportMessages}
            onShareLink={shareLink}
            onShareImage={generateShareImage}
            onReport={handleReport}
            onPinMessage={async (id: string) => {
              const response = await messagesAPI.pinMessage(id)
              if (response.ok) {
                setMessages(messages.map(m => 
                  m.id === parseInt(id) ? { ...m, is_pinned: !m.is_pinned } : m
                ))
              }
            }}
            username={settings.username}
            brandColor={settings.teamColor}
            profilePicture={settings.profilePicture}
          />
        )
      case 'archive':
        return (
          <DashboardArchive
            archivedMessages={archivedMessages}
            darkMode={darkMode}
            onRestore={restoreMessage}
            onPermanentDelete={permanentDeleteMessage}
            onMarkAsRead={markArchivedAsRead}
          />
        )
      case 'qa':
        return <DashboardQAPage />
      case 'wallet':
        return <DashboardWallet darkMode={darkMode} />
      case 'analytics':
        return <DashboardAnalytics stats={stats} darkMode={darkMode} messages={messages} />
      case 'settings':
        return (
          <DashboardSettings 
            settingsForm={settings}
            darkMode={darkMode}
            onSettingsChange={(field: string, value: any) => setSettings({ ...settings, [field]: value })}
            onSocialLinkChange={(platform: string, value: string) => {
              setSettings({ 
                ...settings, 
                socialLinks: { ...settings.socialLinks, [platform]: value } 
              })
            }}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            onSave={saveSettings}
            isSaving={saving}
            isUploading={uploading}
            selectedColor={settings.teamColor}
            setSelectedColor={(color: string) => setSettings({ ...settings, teamColor: color })}
            profilePreview={settings.profilePicture}
            setProfilePreview={() => {}}
            bannerPreview={settings.bannerImage}
            setBannerPreview={() => {}}
            onCustomizationSave={(data) => console.log('Customization saved:', data)}
          />
        )
      default:
        return null
    }
  }

  const getTabTitle = () => {
    switch (activeTab) {
      case 'inbox': return 'Messages'
      case 'archive': return 'Archive'
      case 'qa': return 'Q&A'
      case 'wallet': return 'Wallet & Earnings'
      case 'analytics': return 'Analytics'
      case 'settings': return 'Settings'
      default: return ''
    }
  }

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'inbox': return `${stats.unread} unread messages`
      case 'archive': return `${archivedMessages.length} archived messages`
      case 'qa': return 'Host and manage your Q&A sessions'
      case 'wallet': return 'Manage payouts, view tips, gifts, and revenue'
      case 'analytics': return 'Message insights and statistics'
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="text-center max-w-md p-8">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className={`text-xl font-semibold ${themeClasses.text} mb-2`}>Error</h2>
          <p className={themeClasses.textSec}>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} relative overflow-x-hidden transition-colors duration-300 selection:bg-blue-500 selection:text-white`}>
      {/* Saved Toast Notification */}
      {showSavedAlert && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300 border border-blue-500">
          <Check size={18} className="text-white" />
          <span className="font-semibold text-sm">Settings saved successfully!</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallPrompt && !isPWA && (
        <div className="fixed top-0 left-0 right-0 z-50 p-3 bg-blue-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-base">📱</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Install AnonQ App</h3>
                <p className="text-blue-100 text-xs">Faster access & real-time push notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={dismissPrompt}
                className="px-3 py-1.5 text-xs text-white/80 hover:text-white rounded-lg transition"
              >
                Later
              </button>
              <button
                onClick={installApp}
                disabled={isInstalling}
                className="px-4 py-1.5 bg-white text-blue-600 hover:bg-slate-100 rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                {isInstalling ? 'Installing...' : 'Install'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (lg screens) */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        username={settings.username}
        unreadCount={stats.unread}
        onLogout={handleLogout}
        profilePicture={settings.profilePicture}
      />

      {/* Mobile Bottom Navigation Bar (< lg screens) */}
      <DashboardBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={stats.unread}
        darkMode={darkMode}
      />

      {/* Main Dashboard Workspace */}
      <main className="lg:ml-64 min-h-screen pb-28 lg:pb-12 transition-all duration-300">
        {/* Modern In-Page Header */}
        <header className={`px-5 sm:px-8 py-6 border-b ${themeClasses.border} backdrop-blur-sm`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title & Mobile Quick Brand Bar */}
            <div>
              {/* Mobile brand header snippet */}
              <div className="flex lg:hidden items-center justify-between mb-3 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                    <Sparkles size={14} />
                  </div>
                  <span className="font-extrabold text-base tracking-tight">
                    Anon<span className="text-blue-500">Q</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-xl transition ${
                      darkMode ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'bg-slate-100 text-blue-600 border border-slate-200'
                    }`}
                    title="Toggle Theme"
                  >
                    {darkMode ? <Sun size={15} /> : <Moon size={15} />}
                  </button>
                  <Link
                    href={`/${settings.username}`}
                    target="_blank"
                    className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-semibold flex items-center gap-1"
                  >
                    <span>@{settings.username}</span>
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${themeClasses.text}`}>
                  {getTabTitle()}
                </h1>
              </div>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${themeClasses.textSec}`}>
                {getTabSubtitle()}
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {activeTab === 'inbox' && (
                <button 
                  onClick={shareLink} 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-sm"
                >
                  <Share2 size={15} />
                  <span>Share Profile Link</span>
                </button>
              )}

              {activeTab === 'qa' && (
                <Link href="/dashboard/qa">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-sm">
                    <Plus size={15} />
                    <span>New Q&A Session</span>
                  </button>
                </Link>
              )}

              {activeTab === 'archive' && archivedMessages.length > 0 && (
                <button 
                  onClick={() => {
                    if (confirm('Empty archive? This will permanently delete all archived messages.')) {
                      archivedMessages.forEach(m => permanentDeleteMessage(m.id))
                    }
                  }}
                  className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 active:scale-95"
                >
                  <Trash2 size={15} />
                  <span>Empty Archive</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Tab View Container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </main>
    </div>
  )
}