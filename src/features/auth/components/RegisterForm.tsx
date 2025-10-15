"use client";

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa6";

const RegisterSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    accept_terms: z.boolean(),
});

type RegisterInput = z.infer<typeof RegisterSchema>;

interface RegisterFormProps {
    onEmailSubmit: (email: string, password: string) => Promise<void>;
    onGoogleSubmit: () => Promise<void>;
    loading: boolean;
    navigateWithTransition: (path: string, options?: any) => void;
}

export function RegisterForm({
    onEmailSubmit,
    onGoogleSubmit,
    loading,
    navigateWithTransition,
}: RegisterFormProps) {
    const [form, setForm] = useState<RegisterInput>({
        email: "",
        password: "",
        accept_terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setValidationError(null);

        // Validación con Zod
        const parsed = RegisterSchema.safeParse(form);
        if (!parsed.success) {
        setValidationError(parsed.error.issues[0].message);
        return;
        }

        if (!form.accept_terms) {
        setValidationError("You must accept the terms");
        return;
        }

        await onEmailSubmit(form.email, form.password);
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
        {/* Mensaje de validación local */}
        {validationError && (
            <div className="rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {validationError}
            </div>
        )}

        {/* Campo Email */}
        <div className="space-y-2">
            <label htmlFor="reg-email" className="text-sm font-medium block">
            Email
            </label>
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

        {/* Campo Password */}
        <div className="space-y-2">
            <label htmlFor="reg-password" className="text-sm font-medium block">
            Password
            </label>
            <div className="relative">
            <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
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
            <p className="font-mono text-xs text-neutral-500">
            Use 8+ characters with letters, numbers & symbols
            </p>
        </div>

        {/* Checkbox Terms */}
        <div className="flex flex-row items-center gap-3 pt-2">
            <input
            id="accept_terms"
            type="checkbox"
            className="size-4 accent-[var(--olive-cream)] hover:accent-black"
            checked={form.accept_terms}
            onChange={(e) => setForm({ ...form, accept_terms: e.target.checked })}
            disabled={loading}
            required
            />
            <label htmlFor="accept_terms" className="font-mono text-sm">
            I agree to the{" "}
            
                <a onClick={() =>
                navigateWithTransition("/terms", {
                    direction: "right",
                    color: "white",
                    duration: 1200,
                })
                }
                className="underline hover:text-black cursor-pointer"
            >
                Terms & Privacy Policy
            </a>{" "}
            and the{" "}
            
                <a onClick={() =>
                navigateWithTransition("/cookies", {
                    direction: "right",
                    color: "white",
                    duration: 1200,
                })
                }
                className="underline hover:text-black cursor-pointer"
            >
                Cookies Policy
            </a>
            .
            </label>
        </div>

        {/* Botón Submit */}
        <button
            type="submit"
            disabled={loading || !form.accept_terms}
            className="w-full flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {loading ? "Creating account..." : "Create account"}
        </button>

        {/* Divider */}
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

        {/* Botón Google */}
        <button
            type="button"
            disabled={loading}
            onClick={onGoogleSubmit}
            className="w-full flex items-center justify-center gap-2 cursor-pointer border border-[var(--olive-cream)] rounded-lg py-2 hover:bg-[var(--olive-cream)] hover:text-[var(--olive)] transition"
        >
            Continue with Google
            <FaGoogle />
        </button>

        {/* Link a Login */}
        <p className="mt-6 text-md">
            Already have an account?{" "}
            
            <a onClick={() =>
                navigateWithTransition("/auth/login", {
                direction: "down",
                color: "var(--black)",
                duration: 1200,
                })
            }
            className="underline hover:text-black cursor-pointer"
            >
            Log in
            </a>
        </p>
        </form>
    );
}