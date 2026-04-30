import { createClient } from '@supabase/supabase-js';

// Hardcoded fallbacks to ensure zero-config deployment on Vercel
const DEFAULT_URL = 'https://tatceopytgwllpqamicd.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhdGNlb3B5dGd3bGxwcWFtaWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjkxMTIsImV4cCI6MjA4OTkwNTExMn0.1m0U4J7E8ritxHekEVnuTjK-B95tT40wBoRH_dp0dCk';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);




