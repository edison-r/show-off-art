"use client";

import { useState } from "react";
import { z } from "zod";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Input } from "@app/components/ui/input";

const ResetSchema = z.object({
  email: z.email("Invalid email address"),
});
type ResetInput = z.infer<typeof ResetSchema>;

export default function ResetPasswordPage() {
    const { navigateWithTransition } = useNavigationHelper();
    
    const [form, setForm] = useState<ResetInput>({ email: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<null | { type: "success" | "error"; text: string }>(null);

    const redirectTo = `${location.origin}/auth/update-password`;

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        setMsg(null);
        
        const parsed = ResetSchema.safeParse(form);
        if (!parsed.success) {
        setMsg({ type: "error", text: parsed.error.issues[0].message });
        return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
                redirectTo,
            });

            if (error) throw error;

            setMsg({
                type: "success",
                text: "Check your email for a password reset link",
            });
        } catch (err) {
            const errorMessage = err instanceof Error
            ? err.message
            : "Failed to send reset email";

            setMsg({ type: "error", text: errorMessage });
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[var(--footer)] text-[var(--footer-gray)]">
        <Header />

        <section className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 pb-10 md:pt-20 md:pb-10">
            <h1 className="relative z-10 font-titles font-extrabold text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[8vw] leading-[0.8] select-none">
            Reset password
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
            <div className="w-full max-w-xl">
                <p className="text-lg mb-8 font-light">
                {`Enter your email address and we'll send you a link to reset your password.`}
                </p>

                <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="reset-email" className="text-sm font-medium block">
                    Email
                    </label>
                    <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ email: e.target.value })}
                    disabled={loading}
                    required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition"
                >
                    {loading ? "Sending..." : "Send reset link"}
                </button>

                <div className="flex items-center justify-between pt-4 text-sm">
                    <a 
                    onClick={() => navigateWithTransition('/auth/login', { 
                        direction: 'down', 
                        color: "var(--olive)",
                        duration: 1200
                    })}
                    className="underline hover:text-black cursor-pointer"
                    >
                    ← Back to login
                    </a>
                    
                    <a 
                    onClick={() => navigateWithTransition('/auth/join', { 
                        direction: 'down', 
                        color: "var(--olive)",
                        duration: 1200
                    })}
                    className="underline hover:text-black cursor-pointer"
                    >
                    Create account
                    </a>
                </div>
                </form>

                <div className="mt-12 p-4 border border-[var(--olive-cream)]/30 rounded-lg">
                <p className="font-mono text-sm text-[var(--olive-cream)]/70">
                    <strong>Note:</strong> The reset link will expire in 1 hour. 
                    {`If you don't receive an email, check your spam folder.`}
                </p>
                </div>
            </div>
            </div>
        </section>

        <Footer />
        </main>
    );
}