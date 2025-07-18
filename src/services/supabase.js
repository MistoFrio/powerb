// src/services/supabase.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hshkwjvssesqcwdpnvaa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzaGt3anZzc2VzcWN3ZHBudmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDA3MTgsImV4cCI6MjA2ODQxNjcxOH0.8BBiHUCZB1tRSOYDrNUevHzzvx501EC92c_x9Q-jSM8';

export const supabase = createClient(supabaseUrl, supabaseKey);