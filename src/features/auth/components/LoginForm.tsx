"use client";

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa6";

const SignInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInInput = z.infer<typeof SignInSchema>;

interface LoginFormProps {
    onPasswordSubmit: (email: string, password: string) => Promise<void>;
    onMagicLinkSubmit: (email: string) => Promise<void>;
    onGoogleSubmit: () => Promise<void>;
    loading: boolean;
    navigateWithTransition: (path: string, options?: any) => void;
}

export function LoginForm({
    onPasswordSubmit,
    onMagicLinkSubmit,
    onGoogleSubmit,
    loading,
    navigateWithTransition,
}: LoginFormProps) {
    const [form, setForm] = useState<SignInInput>({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    async function handlePasswordLogin(e: React.FormEvent) {
        e.preventDefault();
        setValidationError(null);

        // Validación con Zod
        const parsed = SignInSchema.safeParse(form);
        if (!parsed.success) {
        setValidationError(parsed.error.issues[0].message);
        return;
        }

        await onPasswordSubmit(form.email, form.password);
    }

    async function handleMagicLink() {
        setValidationError(null);

        if (!form.email) {
        setValidationError("Enter your email to receive a magic link");
        return;
        }

        // Validar solo el email
        const emailResult = z.string().email().safeParse(form.email);
        if (!emailResult.success) {
        setValidationError("Invalid email address");
        return;
        }

        await onMagicLinkSubmit(form.email);
    }

    return (
        <form onSubmit={handlePasswordLogin} className="w-full max-w-xl space-y-4">
        {/* Mensaje de validación local */}
        {validationError && (
            <div className="rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {validationError}
            </div>
        )}

        {/* Campo Email */}
        <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium block">
            Email
            </label>
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

        {/* Campo Password */}
        <div className="space-y-2">
            <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium">
                Password
            </label>
            
                <a onClick={() =>
                navigateWithTransition("/auth/reset-password", {
                    direction: "down",
                    color: "var(--black)",
                    duration: 1200,
                })
                }
                className="font-mono text-xs cursor-pointer hover:text-black"
            >
                Forgot password?
            </a>
            </div>
            <div className="relative">
            <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
                required
            />
            <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs cursor-pointer hover:text-black"
                onClick={() => setShowPassword((v) => !v)}
            >
                {showPassword ? "Hide" : "Show"}
            </button>
            </div>
        </div>

        {/* Botón Submit (Password) */}
        <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Divider */}
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

        {/* Botones Magic Link y Google */}
        <div className="grid grid-cols-2 gap-3">
            <button
            type="button"
            disabled={loading}
            onClick={handleMagicLink}
            className="flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
            Magic link
            </button>
            <button
            type="button"
            disabled={loading}
            onClick={onGoogleSubmit}
            className="flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
            Google
            <FaGoogle />
            </button>
        </div>

        {/* Link a Registro */}
        <p className="mt-6 text-md">
            Don't have an account?{" "}
            
            <a onClick={() =>
                navigateWithTransition("/auth/join", {
                direction: "down",
                color: "var(--black)",
                duration: 1200,
                })
            }
            className="underline hover:text-black cursor-pointer"
            >
            Create one
            </a>
        </p>
        </form>
    );
}