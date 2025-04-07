import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://puflbizxohpnrakpyjaz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZmxiaXp4b2hwbnJha3B5amF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjM0NzAsImV4cCI6MjA1NTk5OTQ3MH0.r_Pcvqf1g4JdMWnnrbwiznUKv0cg3FBydt3zdbFV4xs';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
export const auth = supabase.auth;
