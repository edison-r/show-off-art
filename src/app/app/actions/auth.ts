"use server"

import { getSupabaseServer } from "@/lib/supabase/supabaseServer"
import { redirect } from "next/navigation";

export async function logout() {
    const supabase = await getSupabaseServer();
    await supabase.auth.signOut();
    redirect("/home");
}

export async function getUserDisplayName() {
    try{
        const supabase = await getSupabaseServer();
        const { data: {user}, error: authError } = await supabase.auth.getUser();
            
        if (authError || !user) {
            return {
                success: false,
                error: 'No estás autenticado'
            };
        }
    
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('username, display_name')
            .eq('id', user.id)
            .maybeSingle()
    
        if(error) {
            return {
                succes: false,
                error: error.message
            }
        }

        if(!profile){
            return{
                success: false,
                error: "No se ha encontrado el perfil"
            }
        }

        return {
            success: true,
            data: {
                display_name: profile.display_name,
                username: profile.username
            }
        }
    } catch(error: any){
        return{
            success: false,
            error: error.message || "Error desconocido"
        }
    }
}