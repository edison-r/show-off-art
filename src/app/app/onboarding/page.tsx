import { getSupabaseServer } from "@/lib/supabase/supabaseServer";
import { redirect } from "next/navigation";
import OnboardingForm from "@app/components/OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.username) redirect("/app/dashboard");

  const email = user.email ?? "";
  const proposalFromEmail =
    email.includes("@") ? email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24) : "";
  const defaultDisplay = user.user_metadata?.full_name || proposalFromEmail || "Creative";

  return (
    <main className="mx-auto max-w-[var(--page-max)] px-6 py-12">
      <h1 className="text-2xl font-semibold">Complete your profile</h1>
      <p className="opacity-70 mt-2 text-sm">
        Choose your public username and display name. You can change them later.
      </p>

      <OnboardingForm
        defaultUsername={proposalFromEmail}
        defaultDisplayName={defaultDisplay}
      />
    </main>
  );
}
