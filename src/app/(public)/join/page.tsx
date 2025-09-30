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
  }
}
