// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yhlrmlhbdbolqzkrkxsc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlobHJtbGhiZGJvbHF6a3JreHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTU3NjgsImV4cCI6MjA4Mzk3MTc2OH0.iYb5hNiSEJWjaPk-RqQarHgXn6q5I4uQIKC6QsSeGAY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);