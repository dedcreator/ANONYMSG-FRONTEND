// app/components/VoiceRecorder.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, X, Loader2, Clock, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceRecorderProps {
  darkMode: boolean
  onRecordComplete: (audioBlob: Blob, duration: number) => void
  onCancel: () => void
  maxDuration?: number
}

export function VoiceRecorder({ darkMode, onRecordComplete, onCancel, maxDuration = 60 }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isAudioLoaded, setIsAudioLoaded] = useState(false)

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const timerInterval = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
        timerInterval.current = null
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
    }
  }, [audioURL])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm;codecs=opus' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioURL(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.current.start(100)
      setIsRecording(true)
      setIsPaused(false)
      setDuration(0)

      timerInterval.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording()
            return maxDuration
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please allow microphone access.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorder.current && isRecording && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.pause()
      setIsPaused(true)
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
        timerInterval.current = null
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorder.current && isPaused && mediaRecorder.current.state === 'paused') {
      mediaRecorder.current.resume()
      setIsPaused(false)
      timerInterval.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording()
            return maxDuration
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      try {
        mediaRecorder.current.stop()
      } catch (error) {
        console.error('Error stopping recording:', error)
      }
      setIsRecording(false)
      setIsPaused(false)
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
        timerInterval.current = null
      }
    }
  }

  const handlePlayAudio = () => {
    if (!audioRef.current) return
    
    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        return
      }
      
      // Reset to beginning if ended
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0
      }
      
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.error('Playback error:', error)
            setIsPlaying(false)
            // Try creating a new audio element as fallback
            if (audioURL) {
              const newAudio = new Audio(audioURL)
              newAudio.onended = () => {
                setIsPlaying(false)
                newAudio.remove()
              }
              newAudio.onerror = () => {
                setIsPlaying(false)
                newAudio.remove()
              }
              newAudio.play().catch(() => {
                console.error('Fallback playback failed')
                setIsPlaying(false)
              })
              // Clean up old reference
              if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.src = ''
              }
              audioRef.current = newAudio
            }
          })
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      setIsPlaying(false)
    }
  }

  const handleSend = async () => {
    if (!audioBlob) return
    
    setIsUploading(true)
    try {
      await onRecordComplete(audioBlob, duration)
      // Clean up after successful send
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
      setAudioURL(null)
      setAudioBlob(null)
      setDuration(0)
      audioChunks.current = []
      setIsAudioLoaded(false)
      setIsPlaying(false)
    } catch (error) {
      console.error('Error sending voice message:', error)
      alert('Failed to send voice message. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current)
      timerInterval.current = null
    }
    if (mediaRecorder.current && isRecording) {
      try {
        mediaRecorder.current.stop()
      } catch (error) {
        console.error('Error stopping recording:', error)
      }
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }
    setIsRecording(false)
    setIsPaused(false)
    setAudioURL(null)
    setAudioBlob(null)
    audioChunks.current = []
    setDuration(0)
    setIsAudioLoaded(false)
    setIsPlaying(false)
    onCancel()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const themeClasses = {
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-500',
    card: darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200/50',
    button: darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200',
  }

  return (
    <div className={`${themeClasses.card} rounded-2xl p-4 border`}>
      <AnimatePresence mode="wait">
        {!isRecording && !audioURL ? (
          <motion.div 
            key="initial"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-4"
          >
            <div 
              onClick={startRecording}
              className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition"
            >
              <Mic size={28} className="text-white" />
            </div>
            <p className={`text-sm font-medium ${themeClasses.text}`}>Tap to record voice message</p>
            <p className={`text-xs ${themeClasses.textSecondary}`}>Up to {maxDuration} seconds</p>
          </motion.div>
        ) : isRecording ? (
          <motion.div 
            key="recording"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className={`text-sm font-medium ${themeClasses.text}`}>
                  {isPaused ? 'Paused' : 'Recording...'}
                </span>
              </div>
              <span className={`text-sm font-mono ${themeClasses.textSecondary}`}>
                {formatTime(duration)} / {formatTime(maxDuration)}
              </span>
            </div>
            
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(duration / maxDuration) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              {isPaused ? (
                <button 
                  onClick={resumeRecording} 
                  className={`p-3 rounded-full ${themeClasses.button} transition hover:scale-105`}
                >
                  <Play size={20} className={themeClasses.text} />
                </button>
              ) : (
                <button 
                  onClick={pauseRecording} 
                  className={`p-3 rounded-full ${themeClasses.button} transition hover:scale-105`}
                  disabled={!isRecording}
                >
                  <Pause size={20} className={themeClasses.text} />
                </button>
              )}
              <button 
                onClick={stopRecording} 
                className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition hover:scale-105 shadow-lg shadow-red-500/25"
              >
                <Square size={20} />
              </button>
              <button 
                onClick={handleCancel} 
                className={`p-3 rounded-full ${themeClasses.button} transition hover:scale-105`}
              >
                <X size={20} className={themeClasses.text} />
              </button>
            </div>
          </motion.div>
        ) : audioURL ? (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Clock size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${themeClasses.text}`}>Voice Message</p>
                <p className={`text-xs ${themeClasses.textSecondary}`}>Duration: {formatTime(duration)}</p>
              </div>
            </div>

            <audio 
              ref={audioRef} 
              src={audioURL} 
              onLoadedData={() => setIsAudioLoaded(true)}
              onEnded={() => setIsPlaying(false)}
              onError={() => {
                console.error('Audio error')
                setIsAudioLoaded(false)
                setIsPlaying(false)
              }}
              preload="metadata"
              className="hidden"
            />

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={handlePlayAudio} 
                className={`p-3 rounded-full ${themeClasses.button} transition hover:scale-105`}
                disabled={!isAudioLoaded}
              >
                {isPlaying ? <Pause size={20} className={themeClasses.text} /> : <Play size={20} className={themeClasses.text} />}
              </button>
              <button 
                onClick={handleSend} 
                disabled={isUploading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {isUploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Send'
                )}
              </button>
              <button 
                onClick={handleCancel} 
                className={`p-3 rounded-full ${themeClasses.button} transition hover:scale-105`}
              >
                <Trash2 size={20} className={themeClasses.text} />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}