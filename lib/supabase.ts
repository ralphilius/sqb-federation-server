import { createClient } from "@supabase/supabase-js";

let cached = global.supabase;
const supabase = () => {
  if(cached) return cached;

  cached = initSupabase();
  return cached;
}

export function initSupabase(){
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined")

  return createClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

export default supabase;