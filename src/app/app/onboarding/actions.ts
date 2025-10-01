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

    const result = RegisterSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.issues[0];
      throw new Error(firstError?.message || "Invalid form data");
    }

    const parsed = result.data;
    const username = parsed.username.trim().toLowerCase();

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
      
      if (profileError.code === "23505") {
        throw new Error("Username already taken");
      }
      
      throw new Error("Unable to create profile");
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        username,
        role: "user",
        accepted_terms_at: new Date().toISOString(),
      },
    });

    if (updateError) {
      console.error("Auth update error:", updateError);
    }

    revalidatePath(`/u/${username}`);
    redirect("/app/dashboard");
    
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}