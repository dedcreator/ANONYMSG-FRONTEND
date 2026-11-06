// app/dashboard/components/DashboardSettings.tsx
'use client'

import { useRef, useState } from 'react'
import NextLink from 'next/link'
import { 
  Palette, Share2, User, Shield, Eye, AlertCircle, 
  Camera, Trash2, Save, ArrowRight, Globe, 
  Loader2, Upload, Sparkles, Check, Code,
  Copy, ExternalLink, X, MessageSquare, Link2,
} from 'lucide-react'
import { FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa'
import { DashboardCustomization } from './DashboardCustomization'
import { EmbedGenerator } from '@/app/components/EmbedGenerator'

interface SocialLinks {
  twitter: string
  instagram: string
  youtube: string
  github: string
  website: string
}

interface SettingsForm {
  username: string
  email: string
  bio: string
  teamColor: string
  profilePicture: string | null
  bannerImage: string | null
  publicWall: boolean
  allowVoice: boolean
  autoDelete: boolean
  socialLinks: SocialLinks
}

interface DashboardSettingsProps {
  settingsForm: SettingsForm
  darkMode: boolean
  onSettingsChange: (field: keyof SettingsForm, value: any) => void
  onSocialLinkChange: (platform: keyof SocialLinks, value: string) => void
  onImageUpload: (type: 'profile' | 'banner', file: File) => Promise<void>
  onImageRemove: (type: 'profile' | 'banner') => Promise<void>
  onSave: () => Promise<void>
  isSaving?: boolean
  isUploading?: 'profile' | 'banner' | null
  selectedColor: string
  setSelectedColor: (color: string) => void
  profilePreview?: string | null
  setProfilePreview?: (preview: string | null) => void
  bannerPreview?: string | null
  setBannerPreview?: (preview: string | null) => void
  onCustomizationSave?: (data: any) => void
}

const socialFields: { id: keyof SocialLinks; label: string; icon: any; placeholder: string }[] = [
  { id: 'twitter', label: 'Twitter', icon: FaTwitter, placeholder: 'https://twitter.com/username' },
  { id: 'instagram', label: 'Instagram', icon: FaInstagram, placeholder: 'https://instagram.com/username' },
  { id: 'youtube', label: 'YouTube', icon: FaYoutube, placeholder: 'https://youtube.com/@channel' },
  { id: 'github', label: 'GitHub', icon: FaGithub, placeholder: 'https://github.com/username' },
  { id: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
]

const colorOptions = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Green', value: '#10B981' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Gray', value: '#6B7280' },
]

export function DashboardSettings({ 
  settingsForm, 
  darkMode, 
  onSettingsChange, 
  onSocialLinkChange, 
  onImageUpload, 
  onImageRemove,
  onSave, 
  isSaving = false,
  isUploading = null,
  selectedColor, 
  setSelectedColor,
  onCustomizationSave
}: DashboardSettingsProps) {
  const profileInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [showCustomization, setShowCustomization] = useState(false)
  const [showEmbedGenerator, setShowEmbedGenerator] = useState(false)

  const themeClasses = {
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-500',
    card: darkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm',
    input: darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400',
    hover: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    buttonSecondary: darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  }

  const getSocialValue = (id: keyof SocialLinks): string => {
    return settingsForm.socialLinks?.[id] || ''
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Customization */}
      <div className={`${themeClasses.card} rounded-xl p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette size="18" className="text-gray-500" />
            <h3 className={`text-base font-medium ${themeClasses.text}`}>Page Customization</h3>
          </div>
          <button
            onClick={() => setShowCustomization(!showCustomization)}
            className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${themeClasses.buttonSecondary}`}
          >
            {showCustomization ? (
              <>
                <X size={14} /> Close
              </>
            ) : (
              <>
                <Sparkles size={14} /> Advanced
              </>
            )}
          </button>
        </div>
        <p className={`text-sm ${themeClasses.textSecondary} mb-6`}>Customize how your public profile looks to visitors</p>

        {showCustomization && (
          <div className="mb-6">
            <DashboardCustomization 
              darkMode={darkMode} 
              onSave={onCustomizationSave}
            />
          </div>
        )}

        {/* Banner Image Upload */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Banner Image</label>
          <div className="relative">
            {settingsForm.bannerImage ? (
              <div className="relative rounded-xl overflow-hidden h-32 group">
                <img src={settingsForm.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => bannerInputRef.current?.click()} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition" disabled={isUploading === 'banner'}>
                    <Camera size={18} className="text-white" />
                  </button>
                  <button onClick={() => onImageRemove('banner')} className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition" disabled={isUploading === 'banner'}>
                    <Trash2 size={18} className="text-white" />
                  </button>
                </div>
                {isUploading === 'banner' && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Loader2 size={24} className="text-white animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => bannerInputRef.current?.click()} disabled={isUploading === 'banner'} className={`w-full h-32 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${darkMode ? 'border-gray-700 hover:border-blue-500 bg-gray-800/50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'} disabled:opacity-50`}>
                {isUploading === 'banner' ? (
                  <Loader2 size={24} className="text-blue-500 animate-spin" />
                ) : (
                  <>
                    <Upload size={24} className={themeClasses.textSecondary} />
                    <span className={`text-sm ${themeClasses.textSecondary}`}>Upload Banner Image</span>
                    <span className={`text-xs ${themeClasses.textSecondary}`}>1200 x 300px recommended</span>
                  </>
                )}
              </button>
            )}
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) onImageUpload('banner', e.target.files[0]) }} />
          </div>
        </div>

        {/* Profile Picture Upload */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-20 h-20 rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                {settingsForm.profilePicture ? (
                  <img src={settingsForm.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className={themeClasses.textSecondary} />
                )}
              </div>
              {isUploading === 'profile' && (
                <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                  <Loader2 size={20} className="text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => profileInputRef.current?.click()} disabled={isUploading === 'profile'} className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${themeClasses.buttonSecondary} disabled:opacity-50`}>
                <Camera size={14} /> Upload
              </button>
              {settingsForm.profilePicture && (
                <button onClick={() => onImageRemove('profile')} className="px-3 py-1.5 rounded-lg text-sm transition-all bg-red-500/10 text-red-500 hover:bg-red-500/20">
                  Remove
                </button>
              )}
            </div>
            <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) onImageUpload('profile', e.target.files[0]) }} />
          </div>
        </div>

        {/* Brand Color */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Brand Color</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => { onSettingsChange('teamColor', color.value); setSelectedColor(color.value) }}
                className={`w-8 h-8 rounded-full transition-all ${selectedColor === color.value ? 'ring-2 ring-blue-500 ring-offset-2 ' + (darkMode ? 'ring-offset-gray-900' : 'ring-offset-white') : 'hover:scale-105'}`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input type="color" value={settingsForm.teamColor} onChange={(e) => { onSettingsChange('teamColor', e.target.value); setSelectedColor(e.target.value) }} className="w-10 h-10 rounded cursor-pointer bg-transparent border border-gray-300 dark:border-gray-600" />
            <span className={`text-sm ${themeClasses.textSecondary}`}>Custom color picker</span>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Bio</label>
          <textarea
            rows={3}
            value={settingsForm.bio || ''}
            onChange={(e) => onSettingsChange('bio', e.target.value)}
            className={`w-full ${themeClasses.input} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none`}
            placeholder="Tell visitors about yourself..."
          />
          <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>This will appear on your public profile</p>
        </div>
      </div>

      {/* Social Links */}
      <div className={`${themeClasses.card} rounded-xl p-5`}>
        <h3 className={`text-base font-medium ${themeClasses.text} mb-4 flex items-center gap-2`}>
          <Share2 size="18" className="text-gray-500" />
          Social Links
        </h3>
        <p className={`text-sm ${themeClasses.textSecondary} mb-6`}>Add your social media profiles - they'll appear on your public page</p>
        <div className="space-y-4">
          {socialFields.map((social) => (
            <div key={social.id}>
              <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>{social.label}</label>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <social.icon size={18} className="text-gray-500" />
                </div>
                <input
                  type="url"
                  value={getSocialValue(social.id)}
                  onChange={(e) => onSocialLinkChange(social.id, e.target.value)}
                  className={`flex-1 ${themeClasses.input} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder={social.placeholder}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className={`${themeClasses.card} rounded-xl p-5`}>
        <h3 className={`text-base font-medium ${themeClasses.text} mb-4 flex items-center gap-2`}>
          <User size="18" className="text-gray-500" />
          Account Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>Username</label>
            <input
              type="text"
              value={settingsForm.username || ''}
              onChange={(e) => onSettingsChange('username', e.target.value)}
              className={`w-full ${themeClasses.input} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>
              Your public profile URL: <span className="text-blue-500">/{settingsForm.username || 'username'}</span>
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>Email</label>
            <input
              type="email"
              value={settingsForm.email || ''}
              readOnly
              disabled
              className={`w-full ${themeClasses.input} rounded-xl px-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-75`}
            />
            <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>Email cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className={`${themeClasses.card} rounded-xl p-5`}>
        <h3 className={`text-base font-medium ${themeClasses.text} mb-4 flex items-center gap-2`}>
          <Shield size="18" className="text-gray-500" />
          Privacy Settings
        </h3>
        <div className="space-y-3">
          <label className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${themeClasses.hover}`}>
            <input
              type="checkbox"
              checked={settingsForm.publicWall || false}
              onChange={(e) => onSettingsChange('publicWall', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span className={`text-sm ${themeClasses.textSecondary}`}>Show public message wall</span>
          </label>
          <label className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${themeClasses.hover}`}>
            <input
              type="checkbox"
              checked={settingsForm.allowVoice || false}
              onChange={(e) => onSettingsChange('allowVoice', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span className={`text-sm ${themeClasses.textSecondary}`}>Allow voice messages</span>
          </label>
          <label className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${themeClasses.hover}`}>
            <input
              type="checkbox"
              checked={settingsForm.autoDelete || false}
              onChange={(e) => onSettingsChange('autoDelete', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span className={`text-sm ${themeClasses.textSecondary}`}>Auto-delete messages after 30 days</span>
          </label>
        </div>
      </div>

      {/* Embed Widget - NEW */}
      <div className={`${themeClasses.card} rounded-xl p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code size="18" className="text-blue-500" />
            <h3 className={`text-base font-medium ${themeClasses.text}`}>Embed Widget</h3>
          </div>
          <button
            onClick={() => setShowEmbedGenerator(!showEmbedGenerator)}
            className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${themeClasses.buttonSecondary}`}
          >
            {showEmbedGenerator ? (
              <>
                <X size={14} /> Close
              </>
            ) : (
              <>
                <Link2 size={14} /> Generate Code
              </>
            )}
          </button>
        </div>
        <p className={`text-sm ${themeClasses.textSecondary} mb-4`}>
          Embed an anonymous message box on your website. Copy and paste the code below.
        </p>

        {showEmbedGenerator && (
          <div className="mt-4">
            <EmbedGenerator 
              username={settingsForm.username || 'user'} 
              darkMode={darkMode} 
            />
          </div>
        )}

        {/* Quick preview if not expanded */}
        {!showEmbedGenerator && (
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-900/60' : 'bg-slate-50'} border border-slate-200 dark:border-slate-800`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <MessageSquare size={16} className="text-white" />
              </div>
              <div>
                <p className={`text-sm font-medium ${themeClasses.text}`}>Anonymous Message Widget</p>
                <p className={`text-xs ${themeClasses.textSecondary}`}>Allow visitors to send you anonymous messages</p>
              </div>
              <button
                onClick={() => setShowEmbedGenerator(true)}
                className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition ${themeClasses.buttonSecondary}`}
              >
                Configure
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview */}
      <div className={`${themeClasses.card} rounded-xl p-5`}>
        <h3 className={`text-base font-medium ${themeClasses.text} mb-4 flex items-center gap-2`}>
          <Eye size="18" className="text-blue-500" />
          Live Preview
        </h3>
        <p className={`text-sm ${themeClasses.textSecondary} mb-4`}>See how your page looks to visitors</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <NextLink href={`/${settingsForm.username || 'user'}`} target="_blank" className="flex-1">
            <button className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} rounded-xl transition text-sm font-medium ${themeClasses.text}`}>
              View Your Public Page <ExternalLink size={14} />
            </button>
          </NextLink>
          <button 
            onClick={() => {
              const url = `${window.location.origin}/${settingsForm.username || 'user'}`
              navigator.clipboard.writeText(url)
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 ${themeClasses.buttonSecondary} rounded-xl transition text-sm font-medium`}
          >
            <Copy size={14} /> Copy Link
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${darkMode ? 'bg-rose-950/20 border-rose-850' : 'bg-rose-50 border-rose-200'} rounded-xl p-5 border`}>
        <h3 className="text-base font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
          <AlertCircle size="18" />
          Danger Zone
        </h3>
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>Delete your account and all data. This cannot be undone.</p>
        <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition">Delete Account</button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl transition flex items-center gap-2 text-sm font-semibold disabled:opacity-50 shadow-sm"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}