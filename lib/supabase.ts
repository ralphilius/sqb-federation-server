import { createClient } from "@supabase/supabase-js";

let cached = global.supabase;
const supabase = () => {
  if (cached) return cached;

  cached = initSupabase();
  return cached;
}

export function initSupabase(server: boolean = false) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined")
  let supabaseKey = supabaseAnonKey;
  if (server) {
    if (!supabaseServiceKey) throw new Error("SUPABASE_SERVICE_KEY must be defined")
    supabaseKey = supabaseServiceKey;
  }

  return createClient(
    supabaseUrl,
    supabaseKey
  )
}

export default supabase;