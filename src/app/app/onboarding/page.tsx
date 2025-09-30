import { getSupabaseServer } from "@/lib/supabase/supabaseServer";
import { redirect } from "next/navigation";
import OnboardingForm from "@app/components/OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await getSupabaseServer();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) redirect("/join");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.username) redirect("/app/dashboard");

  // Generar valores por defecto
  const email = user.email ?? "";
  const emailUsername = email.includes("@") 
    ? email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24)
    : "";
  
  const defaultDisplay = 
    user.user_metadata?.full_name || 
    user.user_metadata?.name ||
    emailUsername || 
    "Creative";

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold mb-2">Complete your profile</h1>
      <p className="text-sm text-neutral-600 mb-8">
        Choose your public username and display name. You can change them later.
      </p>

      <OnboardingForm
        defaultUsername={emailUsername}
        defaultDisplayName={defaultDisplay}
      />
    </main>
  );
}