// app/components/AudioWavePlayer.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'

interface AudioWavePlayerProps {
  src: string
  duration?: number | null
  darkMode?: boolean
  compact?: boolean
}

export function AudioWavePlayer({
  src,
  duration = 0,
  darkMode = true,
  compact = false
}: AudioWavePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration || 0)
  const [isMuted, setIsMuted] = useState(false)
  const [bars, setBars] = useState<number[]>([])

  // Resolve absolute audio URL
  const audioUrl = src.startsWith('http')
    ? src
    : src.startsWith('/media')
    ? `${API_BASE_URL.replace('/api', '')}${src}`
    : `${API_BASE_URL.replace('/api', '')}/media/${src.replace(/^\//, '')}`

  // Generate pseudo-waveform bars based on URL hash
  useEffect(() => {
    let hash = 0
    for (let i = 0; i < audioUrl.length; i++) {
      hash = (hash << 5) - hash + audioUrl.charCodeAt(i)
      hash |= 0
    }
    const count = compact ? 16 : 28
    const generated: number[] = []
    for (let i = 0; i < count; i++) {
      const pseudo = Math.abs(Math.sin(hash + i * 1.5)) * 0.75 + 0.25
      generated.push(Math.round(pseudo * 100))
    }
    setBars(generated)
  }, [audioUrl, compact])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(err => console.error('Play failed:', err))
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current && (!totalDuration || totalDuration === 0)) {
      setTotalDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const handleSeek = (index: number) => {
    if (!audioRef.current || totalDuration <= 0) return
    const ratio = index / bars.length
    const newTime = ratio * totalDuration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return '0:00'
    const mins = Math.floor(secs / 60)
    const rem = Math.floor(secs % 60)
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`
  }

  const progressRatio = totalDuration > 0 ? currentTime / totalDuration : 0

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
        darkMode
          ? 'bg-slate-900 border border-slate-800'
          : 'bg-slate-50 border border-slate-200'
      }`}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
        title={isPlaying ? 'Pause' : 'Play voice note'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>

      {/* Waveform Bars */}
      <div className="flex-1 flex items-center gap-1 h-8 px-1 cursor-pointer">
        {bars.map((height, idx) => {
          const isPassed = idx / bars.length <= progressRatio
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSeek(idx)}
              className="flex-1 h-full flex items-center justify-center group focus:outline-none"
            >
              <span
                style={{ height: `${height}%` }}
                className={`w-full max-w-[4px] rounded-full transition-all duration-150 ${
                  isPassed
                    ? 'bg-blue-600'
                    : darkMode
                    ? 'bg-white/20 group-hover:bg-white/40'
                    : 'bg-gray-300 group-hover:bg-gray-400'
                } ${isPlaying && isPassed ? 'animate-pulse' : ''}`}
              />
            </button>
          )
        })}
      </div>

      {/* Timer & Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-xs font-mono font-medium ${
            darkMode ? 'text-blue-300' : 'text-blue-700'
          }`}
        >
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </span>

        <button
          type="button"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.muted = !isMuted
              setIsMuted(!isMuted)
            }
          }}
          className={`p-1.5 rounded-lg text-xs transition ${
            darkMode
              ? 'text-gray-400 hover:text-white hover:bg-white/10'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
    </div>
  )
}
