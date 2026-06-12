import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jtcdwcmojrbijfqioepz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_osmYekIxgtS_Q84viwfxHQ_sZk013mE'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Beat = {
  id: string
  title: string
  bpm: number
  key: string
  mood: string[]
  style: string
  tags: string[]
  price: number
  store_url: string
  cover_url: string | null
  audio_url: string | null
  created_at: string
}

export type Pack = {
  id: string
  name: string
  description: string
  price: number
  contents: string
  cover_url: string | null
  store_url: string
  tags: string[]
  created_at: string
}
