// /login
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { PageWrapper } from "@/app/components/shared/PageWrapper";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Input } from "@app/components/ui/input";
import { FaGoogle } from "react-icons/fa6";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type SignInInput = z.infer<typeof SignInSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { navigateWithTransition } = useNavigationHelper();
  
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

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .maybeSingle();

      router.replace(profile?.username ? "/app/dashboard" : "/app/onboarding");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid email or password";
      setMsg({ type: "error", text: errorMessage });
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Could not send magic link";
      setMsg({ type: "error", text: errorMessage });
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Google sign-in failed";
      setMsg({ type: "error", text: errorMessage });
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--olive)] text-[var(--olive-cream)]">
      <Header />

      <PageWrapper className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 pb-10 md:pt-20 md:pb-10">
        <h1 className="relative z-10 font-titles font-extrabold text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[8vw] leading-[0.8] select-none">
          Welcome back
        </h1>

        {msg && (
          <div
            className={`-mb-10 mt-4 rounded-lg border px-4 py-3 text-sm max-w-xl ${
              msg.type === "error"
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-green-300 bg-green-50 text-green-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="mt-16 items-center">
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
                <a 
                  onClick={() => navigateWithTransition("/auth/reset-password", { 
                    direction: "down", 
                    color: "var(--olive)",
                    duration: 1200
                  })}
                  className="font-mono text-xs cursor-pointer hover:text-black"
                >
                  Forgot password?
                </a>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs cursor-pointer hover:text-black"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--olive-cream)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--olive-cream)] text-[var(--olive)]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleMagicLink}
                className="flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition"
              >
                Magic link
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogle}
                className="flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition"
              >
                Google
                <FaGoogle />
              </button>
            </div>

            <p className="mt-6 text-md">
              {`Don't have an account?`}{" "}
              <a 
                onClick={() => navigateWithTransition("/auth/join", { 
                  direction: "down", 
                  color: "var(--olive)",
                  duration: 1200
                })}
                className="underline hover:text-black cursor-pointer"
              >
                Create one
              </a>
            </p>
          </form>
        </div>
      </PageWrapper>

      <Footer />
    </main>
  );
}