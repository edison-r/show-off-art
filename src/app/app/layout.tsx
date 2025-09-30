import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/supabaseServer";

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const supabase = await getSupabaseServer();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/join");
  }

  return <>{children}</>;
}