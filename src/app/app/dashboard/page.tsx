import { getSupabaseServer } from "@/lib/supabase/supabaseServer";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

    return (
        <main className="mx-auto max-w-[var(--page-max)] px-6 py-12">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2">Welcome{user?.email ? `, ${user.email}` : ""}.</p>
        <ul className="list-disc pl-6 mt-4 text-sm">
            <li>Create/Update your portfolio</li>
            <li>Manage projects (max 6)</li>
            <li>Upload images and CV (PDF)</li>
        </ul>
        </main>
    );
}
