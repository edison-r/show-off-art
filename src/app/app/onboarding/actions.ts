"use server";

import { getSupabaseServer } from "@/lib/supabase/supabaseServer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RegisterSchema } from "@/app/utils/registerSchema";

const RESERVED = new Set(["admin","root","support","api","www","u","auth","login","register"]);

export async function completeOnboarding(formData: unknown) {
    const supabase = await getSupabaseServer();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const parsed = RegisterSchema.parse(formData);
    const username = parsed.username.trim().toLowerCase();
    if (RESERVED.has(username)) {
        throw new Error("This username is reserved");
    }

    const { data: taken } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

    if (taken && taken.id !== user.id) {
        throw new Error("Username already in use");
    }

    const { error: upErr } = await supabase.from("profiles").upsert({
        id: user.id,
        username,
        display_name: parsed.display_name,
        role: "user",
        socials: {},
    });

    if (upErr) throw upErr;

    await supabase.auth.updateUser({
        data: {
        username,
        role: "user",
        accepted_terms_at: new Date().toISOString(),
        },
    });

    revalidatePath(`/u/${username}`);

    redirect("/app/dashboard");
}
