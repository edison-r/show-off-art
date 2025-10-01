import { getSupabaseServer } from "@/lib/supabase/supabaseServer";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await getSupabaseServer();
  
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        redirect("/auth/join");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("username, display_name")
        .eq("id", user.id)
        .maybeSingle();

    if (!profile?.username) {
        redirect("/app/onboarding");
    }

    return (
        <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-neutral-600 mb-8">
            Welcome back, {profile.display_name}
        </p>
        
        <div className="grid gap-6">
            <div className="border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <ul className="space-y-2 text-sm">
                <li>• Create/Update your portfolio</li>
                <li>• Manage projects (max 6)</li>
                <li>• Upload images and CV (PDF)</li>
            </ul>
            </div>
        </div>
        </main>
    );
}