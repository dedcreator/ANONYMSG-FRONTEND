// app/contact/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { Navbar } from '@/components/Navbar'
import { 
  Sparkles, Mail, MessageSquare, Send, Check, MapPin, 
  Phone, Clock, Globe,
  MoveRight
} from 'lucide-react'

import {FaTwitter as Twitter, FaInstagram as Instagram, FaGithub as Github,} from 'react-icons/fa'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  href, 
  darkMode = false, 
  type = 'button',
  fullWidth = false,
  disabled = false
}: any) => {
  const baseStyles = "font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 rounded-xl"
  const widthStyles = fullWidth ? "w-full" : ""
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
  
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: darkMode 
      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
      : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200",
  }
  
  const sizes: any = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }
  
  // If href is provided, render as Link
  if (href) {
    return (
      <Link
        href={href}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  }
  
  // Otherwise render as button
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${disabledStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const Footer = ({ darkMode }: { darkMode: boolean }) => (
  <footer className={`border-t py-16 px-4 transition-colors duration-300 ${darkMode ? 'border-white/5 bg-black' : 'border-gray-200/50 bg-white/50 backdrop-blur-sm'}`}>
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Anon<span className="text-blue-600">Q</span>
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Ask Questions. Stay Anonymous.
          </p>
        </div>
        <div>
          <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/features" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>Features</Link></li>
            <li><Link href="/pricing" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>About</Link></li>
            <li><Link href="/contact" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>Privacy</Link></li>
            <li><Link href="/terms" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className={`text-center text-sm pt-8 border-t ${darkMode ? 'text-gray-600 border-white/5' : 'text-gray-400 border-gray-200/50'}`}>
        © 2024 AnonQ. All rights reserved.
      </div>
    </div>
  </footer>
)

export default function ContactPage() {
  const { darkMode } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setIsSubmitted(false), 5000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const themeClasses = {
    bg: darkMode ? 'bg-black' : 'bg-gray-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSec: darkMode ? 'text-gray-400' : 'text-gray-600',
    input: darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400',
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@anonq.com' },
    { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
    { icon: Clock, label: 'Response Time', value: '24-48 hours' },
    { icon: Globe, label: 'Website', value: 'anonq.com' },
  ]

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-blue-50 border border-blue-100'}`}>
              <MessageSquare size={16} className="text-blue-600" />
              <span className={`text-sm ${themeClasses.textSec}`}>Contact Us</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${themeClasses.text}`}>
              Get in <span className="text-blue-600">Touch</span>
            </h1>
            <p className={`text-xl ${themeClasses.textSec} max-w-2xl mx-auto leading-relaxed`}>
              Have questions? We'd love to hear from you. Reach out and we'll get back to you within 24-48 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>Send a Message</h2>
              
              {isSubmitted ? (
                <div className={`p-6 rounded-2xl text-center ${darkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                  <Check size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold ${themeClasses.text} mb-2`}>Message Sent!</h3>
                  <p className={themeClasses.textSec}>We'll get back to you within 24-48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textSec} mb-1`}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full ${themeClasses.input} rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textSec} mb-1`}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full ${themeClasses.input} rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textSec} mb-1`}>Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full ${themeClasses.input} rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Support">Support</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textSec} mb-1`}>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`w-full ${themeClasses.input} rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition resize-none`}
                      placeholder="Write your message here..."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    darkMode={darkMode} 
                    size="lg" 
                    fullWidth={true} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                    {!isLoading && <Send size={18} />}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>Contact Information</h2>
              
              <div className="space-y-4">
                {contactInfo.map((info, i) => (
                  <div key={i} className={`p-4 rounded-2xl flex items-center gap-4 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200/60 shadow-sm'}`}>
                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <info.icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className={`text-sm ${themeClasses.textSec}`}>{info.label}</p>
                      <p className={`font-medium ${themeClasses.text}`}>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className={`text-sm font-medium ${themeClasses.textSec} mb-4`}>Follow Us</h3>
                <div className="flex gap-3">
                  <a href="#" className={`p-3 rounded-xl transition ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    <Twitter className="w-5 h-5 text-blue-500" />
                  </a>
                  <a href="#" className={`p-3 rounded-xl transition ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    <Instagram className="w-5 h-5 text-pink-500" />
                  </a>
                  <a href="#" className={`p-3 rounded-xl transition ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
          <div className={`rounded-3xl p-12 relative overflow-hidden ${darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-slate-50 border border-slate-200 shadow-sm'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4`}>Need Immediate Help?</h2>
            <p className={`${themeClasses.textSec} mb-8 max-w-2xl mx-auto`}>
              Check out our FAQ or join our community Discord for faster support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/faq">
                <Button variant="secondary" darkMode={darkMode}>View FAQ</Button>
              </Link>
              <Link href="https://discord.gg/anonq">
                <Button darkMode={darkMode}>Join Discord <MoveRight size={18} /></Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  )
}