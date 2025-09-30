"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type SignInInput = z.infer<typeof SignInSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignInInput>({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<null | { type: "success" | "error"; text: string }>(null);

  const redirectTo = `${location.origin}/auth/callback`;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const parsed = SignInSchema.safeParse(form);
    if (!parsed.success) {
      setMsg({ type: "error", text: parsed.error.issues[0].message });
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;

      // Comprobar perfil
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .maybeSingle();

      router.replace(profile?.username ? "/app/dashboard" : "/app/onboarding");
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message ?? "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    setMsg(null);
    if (!form.email) {
      setMsg({ type: "error", text: "Enter your email to receive a magic link" });
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: form.email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setMsg({ type: "success", text: "Check your inbox for the magic link" });
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message ?? "Could not send magic link" });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setMsg(null);
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
      // redirige a Google
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message ?? "Google sign-in failed" });
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 pt-12 pb-24 md:pt-20 md:pb-28">
        <h1 className="font-titles font-extrabold text-[12vw] sm:text-[10vw] md:text-[7vw] lg:text-[6.5vw] leading-[0.8] mb-8">
          Welcome back
        </h1>

        {msg && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm max-w-xl ${
              msg.type === "error"
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-green-300 bg-green-50 text-green-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <form onSubmit={handleLogin} className="w-full max-w-xl space-y-4">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium block">Email</label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-sm font-medium">Password</label>
                <Link href="/reset-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-700"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--bg)] text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" disabled={loading} onClick={handleMagicLink}>
                Magic link
              </Button>
              <Button type="button" variant="outline" disabled={loading} onClick={handleGoogle}>
                Google
              </Button>
            </div>

            <p className="mt-6 text-sm text-neutral-500">
              Don’t have an account?{" "}
              <Link href="/join" className="underline hover:text-blue-600">
                Create one
              </Link>
            </p>
          </form>

          <aside className="w-full max-w-xl">
            <div className="rounded-2xl border border-neutral-200 p-6 sm:p-8 bg-neutral-50">
              <h2 className="font-titles text-2xl sm:text-3xl mb-4">Built for creators</h2>
              <p className="text-sm sm:text-base text-neutral-600 mb-6 leading-relaxed">
                Showcase your work with beautiful, customizable portfolio templates.
              </p>
              <ul className="space-y-3 text-sm sm:text-base text-neutral-700">
                <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span><span>Clean templates</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span><span>Magic link & Google</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span><span>Private & public projects</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
