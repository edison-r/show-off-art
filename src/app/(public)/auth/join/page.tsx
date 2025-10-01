"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { PageWrapper } from "@/app/components/shared/PageWrapper";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Input } from "@app/components/ui/input";
import { FaGoogle } from 'react-icons/fa6';

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  accept_terms: z.literal(true, { message: "You must accept the terms" }),
});
type RegisterInput = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const { navigateWithTransition } = useNavigationHelper();
  
  const [form, setForm] = useState<RegisterInput>({
    email: "",
    password: "",
    accept_terms: false,
  });

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<null | { type: "success" | "error"; text: string }>(null);

  const redirectTo = `${location.origin}/auth/callback`;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const parsed = RegisterSchema.safeParse(form);
    if (!parsed.success) {
      setMsg({ type: "error", text: parsed.error.issues[0].message });
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;

      setMsg({
        type: "success",
        text: "We sent you a verification email. Please check your inbox.",
      });

      // (opcional) después de unos segundos, invitar al login
      // setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message ?? "Registration failed" });
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
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message ?? "Google sign-in failed" });
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--olive)] text-[var(--olive-cream)]">
      <Header />
      <PageWrapper className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 md:pt-20 md:pb-10">
        <h1 className="relative z-10 font-titles font-extrabold text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[8vw] leading-[0.8] select-none">
          Show your work to the world
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
          <form onSubmit={handleRegister} className="w-full max-w-xl space-y-4">
            <div className="space-y-2">
              <label htmlFor="reg-email" className="text-sm font-medium block">Email</label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-password" className="text-sm font-medium block">Password</label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
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
              <p className="font-mono text-xs text-neutral-500">
                Use 8+ characters with letters, numbers & symbols
              </p>
            </div>

            <div className="flex flex-row items-center gap-3 pt-2">
              <input
                id="accept-terms"
                type="checkbox"
                className="size-4 accent-[var(--olive-cream)] hover:accent-black"
                checked={form.accept_terms}
                onChange={(e) => setForm({ ...form, accept_terms: e.target.checked })}
                disabled={loading}
                required
              />
              <label htmlFor="accept-terms" className="font-mono text-sm">
                I agree to the{" "}
                <a 
                  onClick={() => navigateWithTransition('/terms', { 
                    direction: 'right', 
                    color: "white",
                    duration: 1200
                  })}
                  className="underline hover:text-black cursor-pointer"
                > Terms & Privacy Policy</a>{" "}
                and the{" "}
                <a 
                  onClick={() => navigateWithTransition('/cookies', { 
                    direction: 'right', 
                    color: "white",
                    duration: 1200
                  })}
                  className="underline hover:text-black cursor-pointer"
                > Cookies Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !form.accept_terms}
              className="w-full flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--olive-cream)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--olive-cream)] text-[var(--olive)]">
                  Or sign up with
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition"
            >
              Continue with Google
              <FaGoogle />
            </button>

            <p className="mt-6 text-md">
              Already have an account?{" "}
              <a 
                onClick={() => navigateWithTransition('/auth/login', { 
                  direction: 'down', 
                  color: "var(--olive)",
                  duration: 1200
                })}
                className="underline hover:text-black cursor-pointer"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </PageWrapper>

      <Footer />
    </main>
  );
}
