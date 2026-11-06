// app/features/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { Navbar } from '@/components/Navbar'
import { 
  Shield, Zap, Heart, Lock, MessageSquare, Mic, Image, 
  BarChart3, Palette, Globe, Users, Award, Clock, 
  Download, Share2, Archive, Bell, Eye, Star, 
  TrendingUp, Smile, Gift, Crown, Rocket, Target,
  Sparkles, CheckCircle, ArrowRight, Play, AlertCircle, Link as LinkIcon,
  MoveRight, Check, Sparkle
} from 'lucide-react'

// Button Component
const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, href, darkMode = false }: any) => {
  const baseStyles = "font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 rounded-xl"
  
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: darkMode 
      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
      : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20",
  }
  
  const sizes: any = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }
  
  const Component = href ? Link : 'button'
  
  return (
    <Component
      href={href || '#'}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, badge, color, index, darkMode }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -4 }}
    className={`group relative p-6 rounded-2xl transition-all duration-300 ${
      darkMode ? 'bg-white/5 border border-white/10 hover:border-blue-500/30 hover:shadow-xl' : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-xl hover:border-blue-500/50'
    }`}
  >
    {badge && (
      <span className={`absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full ${
        darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
      }`}>
        {badge}
      </span>
    )}
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
      darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
    }`}>
      <Icon className={`w-6 h-6 ${color || 'text-blue-500'}`} />
    </div>
    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {title}
    </h3>
    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed`}>
      {description}
    </p>
  </motion.div>
)

// Category Section Component
const CategorySection = ({ title, description, features, icon: Icon, darkMode }: any) => (
  <div className="mb-20">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-6"
    >
      <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>
    </motion.div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {features.map((feature: any, index: number) => (
        <FeatureCard key={index} {...feature} index={index} darkMode={darkMode} />
      ))}
    </div>
  </div>
)

// Footer Component
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

export default function FeaturesPage() {
  const { darkMode } = useTheme()

  const coreFeatures = [
    {
      icon: Shield,
      title: '100% Anonymous',
      description: 'Your identity is never revealed. No tracking, no logs, complete privacy protection.',
      badge: 'Privacy First',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Instant Delivery',
      description: 'Messages arrive in real-time with our high-performance WebSocket infrastructure.',
      badge: 'Real-time',
      color: 'text-yellow-500'
    },
    {
      icon: Heart,
      title: 'AI Moderation',
      description: 'Advanced machine learning keeps conversations respectful and free from harassment.',
      badge: 'AI Powered',
      color: 'text-red-500'
    },
    {
      icon: Lock,
      title: 'End-to-End Encrypted',
      description: 'Your messages are encrypted and secure. Only you can read them.',
      badge: 'Secure',
      color: 'text-green-500'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with people from over 180 countries worldwide.',
      badge: 'Worldwide',
      color: 'text-cyan-500'
    },
    {
      icon: Users,
      title: 'Unlimited Connections',
      description: 'Receive messages from anyone, anywhere, without any limits.',
      badge: 'Unlimited',
      color: 'text-purple-500'
    }
  ]

  const mediaFeatures = [
    {
      icon: Mic,
      title: 'Voice Messages',
      description: 'Send and receive voice messages up to 60 seconds. Perfect for personal touch.',
      badge: 'New',
      color: 'text-purple-500'
    },
    {
      icon: Image,
      title: 'Media Sharing',
      description: 'Share images and GIFs anonymously with automatic blur preview for safety.',
      badge: 'Rich Media',
      color: 'text-green-500'
    },
    {
      icon: Share2,
      title: 'Share as Image',
      description: 'Share messages as beautiful branded images on social media.',
      badge: 'Social Ready',
      color: 'text-pink-500'
    }
  ]

  const productivityFeatures = [
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track engagement, message trends, and audience insights in real-time.',
      badge: 'Insights',
      color: 'text-orange-500'
    },
    {
      icon: Archive,
      title: 'Message Archive',
      description: 'Auto-archive messages. Never lose important conversations.',
      badge: 'Organized',
      color: 'text-teal-500'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get notified about new messages. Customize your notification preferences.',
      badge: 'Stay Updated',
      color: 'text-indigo-500'
    },
    {
      icon: Eye,
      title: 'Read Receipts',
      description: 'Know when your messages have been read. Optional feature you can control.',
      badge: 'Optional',
      color: 'text-emerald-500'
    },
    {
      icon: Star,
      title: 'Reaction System',
      description: 'React to messages with emojis. Show appreciation without words.',
      badge: 'Engaging',
      color: 'text-yellow-500'
    },
    {
      icon: TrendingUp,
      title: 'Growth Metrics',
      description: 'Track your engagement growth and audience reach over time.',
      badge: 'Analytics',
      color: 'text-blue-500'
    }
  ]

  const customizationFeatures = [
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Personalize your profile with custom colors, banner, and profile picture.',
      badge: 'Personalize',
      color: 'text-pink-500'
    },
    {
      icon: Crown,
      title: 'Pro Member Benefits',
      description: 'Unlock unlimited messages, custom themes, and priority support.',
      badge: 'Premium',
      color: 'text-yellow-500'
    },
    {
      icon: Gift,
      title: 'Anonymous Tips',
      description: 'Send anonymous tips and gifts to show appreciation.',
      badge: 'Fun',
      color: 'text-amber-500'
    }
  ]

  const securityFeatures = [
    {
      icon: Shield,
      title: 'No Tracking',
      description: 'We never track your identity or store identifying information.',
      badge: 'Privacy',
      color: 'text-blue-500'
    },
    {
      icon: Lock,
      title: 'Secure Infrastructure',
      description: 'Enterprise-grade security with regular audits and updates.',
      badge: 'Secure',
      color: 'text-green-500'
    },
    {
      icon: AlertCircle,
      title: 'Report System',
      description: 'Report inappropriate messages instantly. Our team reviews within 24 hours.',
      badge: 'Safety',
      color: 'text-red-500'
    }
  ]

  const themeClasses = {
    bg: darkMode ? 'bg-black' : 'bg-gray-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSec: darkMode ? 'text-gray-400' : 'text-gray-600',
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-blue-50 border border-blue-100'}`}>
              <Sparkles size={16} className="text-blue-600" />
              <span className={`text-sm ${themeClasses.textSec}`}>Powerful Features</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${themeClasses.text}`}>
              Everything You Need for{' '}
              <span className="text-blue-600">
                Anonymous Communication
              </span>
            </h1>
            <p className={`text-xl ${themeClasses.textSec} max-w-3xl mx-auto mb-8 leading-relaxed`}>
              From text messages to voice notes, from basic privacy to advanced analytics — 
              AnonQ provides all the tools you need to connect anonymously.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button darkMode={darkMode} size="lg">
                  Start Free <MoveRight size={18} />
                </Button>
              </Link>
              <Button variant="secondary" darkMode={darkMode} size="lg">
                <Play size={18} /> Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <CategorySection
            title="Core Features"
            description="Essential tools for anonymous messaging"
            icon={Star}
            features={coreFeatures}
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* Media Features */}
      <section className={`py-8 px-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
        <div className="max-w-7xl mx-auto">
          <CategorySection
            title="Rich Media"
            description="Express yourself with more than just text"
            icon={Mic}
            features={mediaFeatures}
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* Productivity Features */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <CategorySection
            title="Productivity & Analytics"
            description="Understand your audience and optimize engagement"
            icon={BarChart3}
            features={productivityFeatures}
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* Customization Features */}
      <section className={`py-8 px-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
        <div className="max-w-7xl mx-auto">
          <CategorySection
            title="Customization"
            description="Make your profile unique and personal"
            icon={Palette}
            features={customizationFeatures}
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* Security Features */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <CategorySection
            title="Security & Privacy"
            description="Your safety is our top priority"
            icon={Shield}
            features={securityFeatures}
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* Comparison Table */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className={`text-sm font-medium text-blue-600 uppercase tracking-wider`}>Pricing</span>
            <h2 className={`text-4xl md:text-5xl font-bold ${themeClasses.text} mb-4 mt-2`}>
              Choose Your <span className="text-blue-600">Plan</span>
            </h2>
            <p className={`text-xl ${themeClasses.textSec} max-w-2xl mx-auto`}>
              Pick the plan that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                darkMode ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-xl'
              }`}
            >
              <h3 className={`text-xl font-bold ${themeClasses.text}`}>Free</h3>
              <div className={`text-4xl font-bold mt-2 mb-6 ${themeClasses.text}`}>
                $0<span className={`text-lg font-normal ${themeClasses.textSec}`}>/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> 50 messages/month</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Basic analytics</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Text messages only</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Standard support</li>
              </ul>
              <Link href="/register">
                <button className={`w-full py-2.5 px-4 rounded-xl font-medium transition ${
                  darkMode ? 'border border-white/20 hover:bg-white/10 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-900'
                }`}>
                  Get Started
                </button>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-2xl p-8 relative transition-all duration-300 hover:-translate-y-1 border-2 border-blue-600 shadow-lg shadow-blue-500/10 ${
                darkMode ? 'bg-slate-900' : 'bg-white'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-sm">
                Most Popular
              </div>
              <h3 className={`text-xl font-bold ${themeClasses.text}`}>Pro</h3>
              <div className={`text-4xl font-bold mt-2 mb-6 ${themeClasses.text}`}>
                $3<span className={`text-lg font-normal ${themeClasses.textSec}`}>/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Unlimited messages</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Voice messages</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Custom themes</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Advanced analytics</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Priority support</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> No ads</li>
              </ul>
              <Link href="/register">
                <button className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-sm">
                  Upgrade to Pro
                </button>
              </Link>
            </motion.div>

            {/* Business Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                darkMode ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-xl'
              }`}
            >
              <h3 className={`text-xl font-bold ${themeClasses.text}`}>Business</h3>
              <div className={`text-4xl font-bold mt-2 mb-6 ${themeClasses.text}`}>
                $8<span className={`text-lg font-normal ${themeClasses.textSec}`}>/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Everything in Pro</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> API access</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Team accounts</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Custom branding</li>
                <li className="flex items-center gap-2 text-sm"><Check size={18} className="text-green-500 shrink-0" /> Dedicated support</li>
              </ul>
              <Link href="/contact">
                <button className={`w-full py-2.5 px-4 rounded-xl font-medium transition ${
                  darkMode ? 'border border-white/20 hover:bg-white/10 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-900'
                }`}>
                  Contact Sales
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className={`rounded-3xl p-12 relative overflow-hidden ${
            darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-slate-50 border border-slate-200 shadow-sm'
          }`}>
            <div className="relative z-10">
              <Sparkle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4`}>
                Ready to Get Started?
              </h2>
              <p className={`${themeClasses.textSec} mb-8 max-w-2xl mx-auto`}>
                Join thousands of users who are already using AnonQ to receive honest, anonymous feedback.
              </p>
              <Link href="/register">
                <Button darkMode={darkMode} size="lg">
                  Create Free Account <MoveRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  )
}