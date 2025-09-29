import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/join"); // o "/login" si tienes esa ruta

  return <>{children}</>;
}
