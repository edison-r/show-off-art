// actions.ts - CON MEJOR MANEJO DE ERRORES
"use server";

import { getSupabaseServer } from "@/lib/supabase/supabaseServer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RegisterSchema } from "@/app/utils/registerSchema";

export async function completeOnboarding(formData: unknown) {
  try {
    const supabase = await getSupabaseServer();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Authentication required");
    }

    // Validación con Zod
    const parsed = RegisterSchema.parse(formData);
    const username = parsed.username.trim().toLowerCase();

    // Verificar disponibilidad ANTES de hacer upsert
    const { data: existing, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking username:", checkError);
      throw new Error("Unable to verify username availability");
    }

    if (existing && existing.id !== user.id) {
      throw new Error("Username already taken");
    }

    // Crear/actualizar perfil
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        username,
        display_name: parsed.display_name,
        role: "user",
        socials: {},
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "id"
      });

    if (profileError) {
      console.error("Profile upsert error:", profileError);
      
      // Capturar el error de constraint unique
      if (profileError.code === "23505") {
        throw new Error("Username already taken");
      }
      
      throw new Error("Unable to create profile");
    }

    // Actualizar metadata del usuario
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        username,
        role: "user",
        accepted_terms_at: new Date().toISOString(),
      },
    });

    if (updateError) {
      console.error("Auth update error:", updateError);
      // No fallar si solo falla la metadata
    }

    revalidatePath(`/u/${username}`);
    redirect("/app/dashboard");
    
  } catch (error: any) {
    // Si es un error de Zod, re-lanzar con mensaje claro
    if (error.name === "ZodError") {
      const firstError = error.errors?.[0];
      throw new Error(firstError?.message || "Invalid form data");
    }
    
    // Re-lanzar el error con el mensaje que ya tenemos
    throw error;
  }
}