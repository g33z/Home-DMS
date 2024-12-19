import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.WAKU_PUBLIC_API_URL, import.meta.env.WAKU_PUBLIC_ANON_KEY);
export default supabase;