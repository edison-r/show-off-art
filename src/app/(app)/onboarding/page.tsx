import { getSupabaseServer } from "@/lib/supabase/supabaseServer";
import { redirect } from "next/navigation";
import OnboardingForm from "@/features/auth/components/OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await getSupabaseServer();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) redirect("/auth/join");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.username) redirect("/app/dashboard");

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
    <main className="min-h-screen bg-[var(--black)] text-[var(--black-cream)]">
      <section className="relative mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 pt-12 pb-24 md:pt-20 md:pb-28">
        <h1 className="font-titles font-extrabold leading-[1.05] text-[12vw] sm:text-[10vw] md:text-[7vw] lg:text-[6vw] mb-4">
          Complete your profile
        </h1>

        <p className="text-sm sm:text-base text-blue-gray max-w-2xl mb-10">
          Choose your public username and display name. You can change them later.
        </p>

        <div className="rounded-2xl border border-footer-gray/30 bg-black/5 backdrop-blur p-5 sm:p-6 md:p-8 max-w-2xl">
          <OnboardingForm
            defaultUsername={emailUsername}
            defaultDisplayName={defaultDisplay}
          />
        </div>
      </section>
    </main>
  );
}