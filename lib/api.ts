// frontend/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
export { API_BASE_URL }

// Helper function to get auth token
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

// API request helper
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const mergedHeaders = { ...headers, ...(options.headers as Record<string, string> || {}) }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: mergedHeaders,
  })
  
  // Handle token refresh on 401
  if (response.status === 401) {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
    if (refreshToken && !endpoint.includes('/token/refresh/')) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        })
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          localStorage.setItem('access_token', data.access)
          if (data.refresh) localStorage.setItem('refresh_token', data.refresh)
          
          mergedHeaders['Authorization'] = `Bearer ${data.access}`
          return fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: mergedHeaders,
          })
        } else {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
      }
    }
  }
  
  return response
}

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string; password2: string }) =>
    apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getMe: () => apiRequest('/auth/me/'),
  
  verifyEmail: (data: { token: string; email: string }) =>
    apiRequest('/auth/verify-email/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  resendVerification: (data: { email: string }) =>
    apiRequest('/auth/resend-verification/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  forgotPassword: (data: { email: string }) =>
    apiRequest('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  resetPassword: (data: { token: string; email: string; new_password: string; confirm_password: string }) =>
    apiRequest('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSettings: () => apiRequest('/auth/settings/'),
  updateSettings: (data: any) =>
    apiRequest('/auth/settings/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}

// Profile API
export const profileAPI = {
  getProfile: () => apiRequest('/profile/'),
  
  updateProfile: (data: FormData | Record<string, any>) => {
    const token = getToken()
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
    
    const headers: Record<string, string> = {}
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return fetch(`${API_BASE_URL}/profile/`, {
      method: 'PATCH',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    })
  },
  
  getPublicProfile: (username: string) =>
    apiRequest(`/profile/public/${username}/`),
}

// Messages API
export const messagesAPI = {
  getInbox: (page = 1, type?: string) => 
    apiRequest(`/messages/inbox/?page=${page}${type ? `&type=${type}` : ''}`),
  
  getArchived: (page = 1) => apiRequest(`/messages/archived/?page=${page}`),
  
  getPublicWall: (username: string, page = 1) =>
    apiRequest(`/messages/wall/${username}/?page=${page}`),
  
  // Text & Super message
  sendMessage: (data: {
    recipient_username: string
    content: string
    message_type?: string
    gift_amount?: number
    gift_currency?: string
    is_super_message?: boolean
    super_message_color?: string
  }) =>
    apiRequest('/messages/send/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Voice message with FormData
  sendVoiceMessage: (formData: FormData) => {
    const token = getToken()
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return fetch(`${API_BASE_URL}/messages/send-voice/`, {
      method: 'POST',
      headers,
      body: formData,
    })
  },
  
  // Image message with FormData
  sendImageMessage: (formData: FormData) => {
    const token = getToken()
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return fetch(`${API_BASE_URL}/messages/send-image/`, {
      method: 'POST',
      headers,
      body: formData,
    })
  },
  
  // GIF message
  sendGIFMessage: (data: { recipient_username: string; content: string }) =>
    apiRequest('/messages/send/', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        message_type: 'gif'
      }),
    }),
  
  getMessage: (messageId: string) => apiRequest(`/messages/${messageId}/`),
  
  markAsRead: (messageId: string) =>
    apiRequest(`/messages/${messageId}/read/`, { method: 'POST' }),
  
  reactMessage: (messageId: string, reaction: string) =>
    apiRequest(`/messages/${messageId}/react/`, {
      method: 'POST',
      body: JSON.stringify({ reaction }),
    }),
  
  replyMessage: (messageId: string, data: { creator_reply: string; publish_to_wall?: boolean }) =>
    apiRequest(`/messages/${messageId}/reply/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  toggleWall: (messageId: string, is_public?: boolean) =>
    apiRequest(`/messages/${messageId}/toggle-wall/`, {
      method: 'POST',
      body: JSON.stringify({ is_public }),
    }),
  
  deleteMessage: (messageId: string) =>
    apiRequest(`/messages/${messageId}/delete/`, { method: 'DELETE' }),
  
  permanentDelete: (messageId: string) =>
    apiRequest(`/messages/${messageId}/permanent-delete/`, { method: 'DELETE' }),
  
  reportMessage: (messageId: string, reason: string, description?: string) =>
    apiRequest(`/messages/${messageId}/report/`, {
      method: 'POST',
      body: JSON.stringify({ reason, description }),
    }),
  
  getStats: () => apiRequest('/messages/stats/'),
  
  archiveMessage: (messageId: string) =>
    apiRequest(`/messages/${messageId}/archive/`, { method: 'POST' }),
  
  restoreMessage: (messageId: string) =>
    apiRequest(`/messages/${messageId}/restore/`, { method: 'POST' }),
  
  pinMessage: (messageId: string) =>
    apiRequest(`/messages/${messageId}/pin/`, { method: 'POST' }),
  
  unpinMessage: (messageId: string) =>
    apiRequest(`/messages/${messageId}/unpin/`, { method: 'POST' }),
}

// Q&A API
export const qaAPI = {
  getSessions: (params?: { live?: boolean; host?: string } | boolean) => {
    const q = new URLSearchParams()
    if (typeof params === 'boolean') {
      if (params) q.append('live', 'true')
    } else if (params) {
      if (params.live) q.append('live', 'true')
      if (params.host) q.append('host', params.host)
    }
    const queryString = q.toString()
    return apiRequest(`/messages/qa/sessions/${queryString ? `?${queryString}` : ''}`)
  },
  
  getSession: (id: string, passToken?: string) => {
    const headers: Record<string, string> = {}
    if (passToken) {
      headers['X-QA-Pass-Token'] = passToken
    }
    return apiRequest(`/messages/qa/sessions/${id}/`, { headers })
  },
  
  createSession: (data: {
    title: string
    description?: string
    starts_at: string
    ends_at?: string | null
    allow_anonymous?: boolean
    require_approval?: boolean
    max_questions?: number
    is_paid?: boolean
    price?: number
    currency?: string
    paid_perks?: string
  }) =>
    apiRequest('/messages/qa/sessions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateSession: (id: string, data: any) => 
    apiRequest(`/messages/qa/sessions/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  deleteSession: (id: string) => 
    apiRequest(`/messages/qa/sessions/${id}/`, { method: 'DELETE' }),
  
  toggleLive: (id: string, isLive?: boolean) => 
    apiRequest(`/messages/qa/sessions/${id}/live/`, {
      method: 'POST',
      body: JSON.stringify({ is_live: isLive }),
    }),
  
  getQuestions: (sessionId: string, filter?: string) => 
    apiRequest(`/messages/qa/questions/?session_id=${sessionId}${filter ? `&filter=${filter}` : ''}`),
  
  submitQuestion: (data: {
    session_id: string
    question: string
    is_anonymous?: boolean
    asker_name?: string
    is_super_question?: boolean
    gift_amount?: number
    gift_currency?: string
    access_token?: string
  }) => {
    const headers: Record<string, string> = {}
    if (data.access_token) {
      headers['X-QA-Pass-Token'] = data.access_token
    }
    return apiRequest('/messages/qa/questions/', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
  },
  
  upvoteQuestion: (id: string) => 
    apiRequest(`/messages/qa/questions/${id}/upvote/`, { method: 'POST' }),
  
  pinQuestion: (id: string, isPinned?: boolean) => 
    apiRequest(`/messages/qa/questions/${id}/pin/`, {
      method: 'POST',
      body: JSON.stringify({ is_pinned: isPinned }),
    }),
  
  submitAnswer: (data: { question_id: string; answer: string; media_url?: string }) => 
    apiRequest('/messages/qa/answers/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Payments & Flutterwave API
export const paymentsAPI = {
  initializeGift: (data: {
    creator_username: string
    amount: number
    currency?: string
    sender_alias?: string
    is_anonymous?: boolean
    message?: string
    payer_email?: string
    redirect_url?: string
  }) =>
    apiRequest('/payments/initialize-gift/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  initializeQAPass: (data: {
    session_id: string
    email: string
    name?: string
    redirect_url?: string
  }) =>
    apiRequest('/payments/initialize-qa-pass/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyPayment: (data: { tx_ref: string; transaction_id?: string }) =>
    apiRequest('/payments/verify/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getWallet: () => apiRequest('/payments/wallet/'),

  updateWallet: (data: {
    bank_name?: string
    bank_code?: string
    account_number?: string
    account_name?: string
    minimum_gift_amount?: number
    allow_gifting?: boolean
    show_leaderboard?: boolean
  }) =>
    apiRequest('/payments/wallet/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getTransactions: () => apiRequest('/payments/transactions/'),

  getGifts: () => apiRequest('/payments/gifts/'),

  getLeaderboard: (username: string) =>
    apiRequest(`/payments/leaderboard/${username}/`),

  getBanks: (country = 'NG') =>
    apiRequest(`/payments/banks/?country=${country}`),

  resolveAccount: (data: { account_number: string; bank_code: string }) =>
    apiRequest('/payments/resolve-account/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  requestPayout: (data: {
    amount: number
    bank_name?: string
    bank_code?: string
    account_number?: string
    account_name?: string
  }) =>
    apiRequest('/payments/request-payout/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkQAAccess: (sessionId: string, params?: { token?: string; email?: string }) => {
    const q = new URLSearchParams()
    if (params?.token) q.append('token', params.token)
    const qs = q.toString()
    return apiRequest(`/payments/qa-access/${sessionId}/${qs ? `?${qs}` : ''}`)
  },
}

// Polls API
export const pollsAPI = {
  getPolls: () => apiRequest('/messages/polls/'),
  
  getPoll: (pollId: string) => apiRequest(`/messages/polls/${pollId}/`),
  
  createPoll: (data: { 
    question: string; 
    options: string[]; 
    expires_at?: string | null; 
    allow_multiple_votes?: boolean;
  }) => apiRequest('/messages/polls/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  vote: (pollId: string, optionId: number) => 
    apiRequest(`/messages/polls/${pollId}/vote/`, {
      method: 'POST',
      body: JSON.stringify({ option_id: optionId, poll_id: pollId }),
    }),
  
  deletePoll: (pollId: string) => 
    apiRequest(`/messages/polls/${pollId}/`, { method: 'DELETE' }),
}

