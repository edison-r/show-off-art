import { supabase } from "@/lib/supabase/supabaseClient";

export async function isUsernameAvailable(u:string) {
    const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", u.toLowerCase())
        .limit(1)
        .maybeSingle();
    return !data && !error;
}