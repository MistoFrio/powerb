// src/services/supabase.js

import { createClient } from '@supabase/supabase-js';

// Obtenha a URL e a chave do Supabase das variáveis de ambiente
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// Criação do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
