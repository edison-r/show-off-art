"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { completeOnboarding } from "@/app/app/actions/onboarding";
import { RegisterSchema, type RegisterInput } from "@/app/utils/registerSchema";

export default function OnboardingForm({ 
    defaultUsername, 
    defaultDisplayName, 
}: { 
    defaultUsername: string; 
    defaultDisplayName: string; 
}) {
    const form = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: defaultUsername,
            display_name: defaultDisplayName,
        },
        mode: "onBlur",
    });

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            await completeOnboarding(values);
        } catch (e) {
            console.error("Onboarding error:", e);
            
            let errorMessage = "Something went wrong. Please try again.";
            
            if (e instanceof Error) {
                errorMessage = e.message;
            } else if (
                typeof e === "object" && 
                e !== null && 
                "code" in e && 
                e.code === "23505"
            ) {
                errorMessage = "Username already taken";
            }
            
            if (errorMessage.toLowerCase().includes("username")) {
                form.setError("username", { 
                    message: errorMessage 
                });
            } else if (errorMessage.toLowerCase().includes("display")) {
                form.setError("display_name", { 
                    message: errorMessage 
                });
            } else {
                form.setError("root", { 
                    message: errorMessage 
                });
            }
        }
    });

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
        {form.formState.errors.root && (
            <div className="p-3 rounded-lg border border-red-300 bg-red-50 text-sm text-red-700">
            {form.formState.errors.root.message}
            </div>
        )}

        <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium block">
            Username
            </label>
            <Input
                id="username"
                placeholder="username"
                {...form.register("username")}
                onChange={(e) => {
                    const normalized = e.target.value
                    .replace(/\s+/g, "-")
                    .replace(/[^a-zA-Z0-9_-]/g, "");
                    form.setValue("username", normalized, {
                    shouldValidate: false,
                    shouldDirty: true,
                    });
                }}
            />
            {form.formState.errors.username ? (
            <p className="text-sm text-red-600">
                {form.formState.errors.username.message}
            </p>
            ) : (
            <p className="text-xs text-blue-gray">
                Letters, numbers, “_” and “-” only. 3–24 characters.
            </p>
            )}
        </div>

        <div className="space-y-2">
            <label htmlFor="display_name" className="text-sm font-medium block">
            Display name
            </label>
            <Input
                id="display_name"
                placeholder="Your public name"
                {...form.register("display_name")}
            />
            {form.formState.errors.display_name && (
            <p className="text-sm text-red-600">
                {form.formState.errors.display_name.message}
            </p>
            )}
        </div>

        <div className="space-y-2">
            <label htmlFor="accept_terms" className="flex items-start gap-3">
            <input
                id="accept_terms"
                type="checkbox"
                className="mt-1 size-4 accent-[var(--black-cream)] hover:accent-black"
                {...form.register("accept_terms")}
            />
            <span className="text-sm">
                I accept the{" "}
                <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--fire)]"
                >
                Terms &amp; Privacy Policy
                </a>
                .
            </span>
            </label>
            {form.formState.errors.accept_terms && (
            <p className="text-sm text-red-600">
                {form.formState.errors.accept_terms.message}
            </p>
            )}
        </div>

        {/* Submit — botón nativo estilo home */}
        <button
            type="submit"
            disabled={
            form.formState.isSubmitting || !form.watch("accept_terms")
            }
            className="w-full cursor-pointer underline hover:text-[var(--fire)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
            {form.formState.isSubmitting ? "Saving..." : "Complete profile"}
        </button>
        </form>
    );
}