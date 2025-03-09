const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("⚠️  Missing Supabase environment variables!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
module.exports = supabase;
