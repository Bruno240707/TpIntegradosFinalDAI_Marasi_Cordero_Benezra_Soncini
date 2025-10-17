import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cttgwajlkvibxcgvkicl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dGd3YWpsa3ZpYnhjZ3ZraWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDg5MDIsImV4cCI6MjA3NjIyNDkwMn0.FNiTnXsRrb1GsznDOTeoGmo_2_fHttS-qmmeo3K56bw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
