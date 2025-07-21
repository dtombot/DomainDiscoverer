import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbfjkakpdrgewocqqott.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZmprYWtwZHJnZXdvY3Fxb3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjA2NDYsImV4cCI6MjA2NTQ5NjY0Nn0.z27Cgslx-rWspgr-Uv-aQkcCK6SoRslY1t0DRxXl1NY'; // your anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
