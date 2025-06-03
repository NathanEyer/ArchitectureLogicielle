
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://spvybzxnfwqukmyvzupd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdnlienhuZndxdWtteXZ6dXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Mzg1MzYsImV4cCI6MjA2NDUxNDUzNn0.Xu6f7KK74BXY5FZdHwC0Ww4x6x48EozUm45impZwz7Q';
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
