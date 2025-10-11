import { getSupabaseServer } from "@/lib/supabase/supabaseServer";

export default async function PublicPortfolio({ params: { username } }:{ params: { username: string } }) {
  const supabase = await getSupabaseServer();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, socials")
    .eq("username", username)
    .single();

  if (!profile) return <div className="p-6">Portfolio not found</div>;

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("id, title, visibility, template_key, template_data")
    .eq("owner_id", profile.id)
    .single();

  if (!portfolio || portfolio.visibility === "draft") {
    return <div className="p-6">Portfolio not available</div>;
  }

  return (
    <main className="mx-auto max-w-[var(--page-max)] px-6 py-12">
      <header className="flex items-center gap-4">
        {profile.avatar_url && <img src={profile.avatar_url} alt={profile.display_name} className="size-16 rounded-full" />}
        <div>
          <h1 className="text-3xl font-semibold">{portfolio.title}</h1>
          <p className="text-sm opacity-70">@{profile.username}</p>
        </div>
      </header>
      {/* TODO: aquí enchufamos el layout Bento cuando lo tengas */}
    </main>
  );
}
