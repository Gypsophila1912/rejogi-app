import "dotenv/config"; 
import { createClient } from "@supabase/supabase-js";


console.log("Supabase URL Check:", process.env.SUPABASE_URL ? "OK" : "Empty");

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);