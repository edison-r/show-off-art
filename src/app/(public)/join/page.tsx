"use client";

import { z } from "zod";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useState } from "react";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";

export const RegisterSchema = z.object({
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_-]+$/),
  display_name: z.string().min(2).max(80),
  accept_terms: z.literal(true, { message: "You must accept terms" }),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpWithEmailPassword = async () => {
    await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } })
    alert("Check your email to finish sign-up.");
  }

    return (
    <main className="grid place-items-center min-h-[80dvh] p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign up</h1>
        <form onSubmit={signUpWithEmailPassword} className="space-y-3">
          <Input placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </form>
        <Button variant="outline" className="w-full" onClick={signUpWithEmailPassword}>Sign up</Button>
      </div>
    </main>
  );
  
}
