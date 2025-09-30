"use client";

import { supabase } from "@/lib/supabase/supabaseClient";
import { useState } from "react";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` }});
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
    alert("Check your email to finish sign-in.");
  };

  return (
    <main className="grid place-items-center min-h-[80dvh] p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <form onSubmit={signInWithEmail} className="space-y-3">
          <Input placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <Button type="submit" className="w-full">Continue with Email</Button>
        </form>
        <div className="text-center text-sm opacity-60">or</div>
        <Button variant="outline" className="w-full" onClick={signInWithGoogle}>Continue with Google</Button>
      </div>
    </main>
  );
}
