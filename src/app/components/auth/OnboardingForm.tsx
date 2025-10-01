"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { completeOnboarding } from "@/app/app/onboarding/actions";
import { RegisterSchema, type RegisterInput } from "@/app/utils/registerSchema";

export default function OnboardingForm({ defaultUsername, defaultDisplayName, }: { defaultUsername: string; defaultDisplayName: string; }) {
    const form = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: defaultUsername,
            display_name: defaultDisplayName,
            accept_terms: false,
        },
        mode: "onBlur", // Validar solo al perder focus
    });

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            await completeOnboarding(values);
        } catch (e: any) {
            console.error("Onboarding error:", e);
            
            let errorMessage = "Something went wrong. Please try again.";
            
            if (e?.message) {
                errorMessage = e.message;
            } else if (e?.code === "23505") {
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
        <form onSubmit={onSubmit} className="space-y-6 max-w-lg">
        {form.formState.errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {form.formState.errors.root.message}
            </div>
        )}

        <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium block"> Username </label>
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
                        shouldDirty: true 
                    });
                }}
            />

            {form.formState.errors.username && (
                <p className="text-sm text-red-600"> {form.formState.errors.username.message} </p>
            )}
            <p className="text-xs text-neutral-500"> {`Letters, numbers, "_" and "-" only. 3-24 characters.`}</p>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
            <label htmlFor="display_name" className="text-sm font-medium block"> Display name </label>
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
            <div className="flex items-start gap-3">
            <input 
                id="accept_terms" 
                type="checkbox" 
                className="mt-1 size-4" 
                {...form.register("accept_terms")} 
            />
            <label htmlFor="accept_terms" className="text-sm">
                I accept the{" "}
                <a  href="/terms" target="_blank" className="underline hover:text-blue-600">
                    Terms & Privacy Policy
                </a>
            </label>
            </div>
            {form.formState.errors.accept_terms && (
                <p className="text-sm text-red-600">
                    {form.formState.errors.accept_terms.message}
                </p>
            )}
        </div>

        <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="w-full"
        >
            {form.formState.isSubmitting ? "Saving..." : "Complete profile"}
        </Button>
        </form>
    );
}