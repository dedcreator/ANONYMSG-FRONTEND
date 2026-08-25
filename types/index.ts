// types/index.ts

export interface User {
  id: number | string
  username: string
  email: string
  is_verified?: boolean
  created_at: string
  total_messages_received?: number
  custom_css?: string
  profile_theme?: string
  custom_font?: string
  public_wall?: boolean
  allow_voice?: boolean
  auto_delete?: boolean
  email_notifications?: boolean
  push_notifications?: boolean
  weekly_digest?: boolean
}

export interface Profile {
  username: string
  email?: string
  bio: string
  profile_picture: string | null
  banner_image: string | null
  team_color: string
  theme: string
  twitter?: string | null
  instagram?: string | null
  youtube?: string | null
  tiktok?: string | null
  github?: string | null
  website?: string | null
  discord?: string | null
  total_messages?: number
  message_count?: number
  join_date?: string
  created_at?: string
  updated_at?: string
  public_wall?: boolean
  allow_gifting?: boolean
  minimum_gift_amount?: number
  currency?: string
}

export interface AnonymousMessage {
  id: string
  recipient_username?: string
  content: string
  message_type: 'text' | 'voice' | 'image' | 'gif'
  media_url?: string | null
  media_duration?: number | null
  media_thumbnail?: string | null
  created_at: string
  is_read: boolean
  reaction?: string | null
  is_pinned: boolean
  is_archived?: boolean
  is_public_on_wall?: boolean
  creator_reply?: string | null
  replied_at?: string | null
  gift_amount?: number | string
  gift_currency?: string
  is_super_message?: boolean
  super_message_color?: string | null
}

export interface QAAnswer {
  id: string
  answer: string
  media_url?: string | null
  answered_by_username: string
  created_at: string
  updated_at?: string
}

export interface QAQuestion {
  id: string
  question: string
  is_anonymous: boolean
  asker_name?: string | null
  is_answered: boolean
  is_approved: boolean
  is_pinned: boolean
  upvotes: number
  is_super_question?: boolean
  gift_amount?: number | string
  gift_currency?: string
  asked_by_username?: string
  answer?: QAAnswer | null
  created_at: string
  user_has_upvoted?: boolean
}

export interface QASession {
  id: string
  title: string
  description?: string
  is_active: boolean
  is_live: boolean
  starts_at: string
  ends_at?: string | null
  allow_anonymous: boolean
  require_approval: boolean
  is_paid?: boolean
  price?: number | string
  currency?: string
  paid_perks?: string
  total_revenue?: number | string
  host_username: string
  questions?: QAQuestion[]
  question_count?: number
  is_host?: boolean
  has_access?: boolean
  created_at: string
  updated_at?: string
}

export interface Wallet {
  username: string
  balance: number | string
  total_earned: number | string
  total_withdrawn: number | string
  currency: string
  bank_name: string
  bank_code: string
  account_number: string
  account_name: string
  minimum_gift_amount: number | string
  allow_gifting: boolean
  show_leaderboard: boolean
  created_at: string
  updated_at: string
}

export interface PaymentTransaction {
  id: string
  tx_ref: string
  flw_ref?: string
  transaction_type: 'gift' | 'paid_qa_access' | 'super_question' | 'super_message' | 'payout'
  amount: number | string
  currency: string
  status: 'pending' | 'successful' | 'failed' | 'cancelled'
  creator_username: string
  payer_email?: string
  payer_name?: string
  is_anonymous: boolean
  donor_alias?: string
  gift_note?: string
  qa_session?: string | null
  message?: string | null
  created_at: string
}

export interface Gift {
  id: string
  creator_username?: string
  amount: number | string
  currency: string
  display_sender?: string
  sender?: string
  sender_alias?: string
  is_anonymous: boolean
  message?: string
  badge: 'Bronze Supporter' | 'Silver VIP' | 'Gold Champion' | 'Diamond Legend' | 'Angel Backer'
  created_at: string
}

export interface PayoutRequest {
  id: string
  username: string
  amount: number | string
  currency: string
  bank_name: string
  bank_code: string
  account_number: string
  account_name: string
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  note?: string
  created_at: string
  processed_at?: string | null
}

export interface Bank {
  id: number
  code: string
  name: string
}