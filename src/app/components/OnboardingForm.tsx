"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { completeOnboarding } from "@/app/app/onboarding/actions";

const RegisterSchema = z.object({
  username: z.string().min(3, "Min 3 characters").max(24, "Max 24 characters").regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, _ and -"),
  display_name: z.string().min(2, "Min 2 characters").max(80, "Max 80 characters"),
  accept_terms: z.literal(true, { message: "You must accept the terms" } ),
});
type RegisterInput = z.infer<typeof RegisterSchema>;

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
        accept_terms: true,
        },
        mode: "onChange",
    });

    const [checking, setChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const usernameValue = form.watch("username");

    const debouncedCheck = useMemo(() => {
        let t: any;
        return (val: string) => {
        clearTimeout(t);
        t = setTimeout(async () => {
            const normalized = (val || "").trim().toLowerCase();
            if (!normalized || normalized.length < 3) {
                setIsAvailable(null);
                return;
            }
            setChecking(true);
            const { data, error } = await supabase
                .from("profiles")
                .select("id")
                .eq("username", normalized)
                .maybeSingle();
                setChecking(false);
                setIsAvailable(!data && !error);
        }, 350);
        };
    }, []);

    useEffect(() => {
        debouncedCheck(usernameValue);
    }, [usernameValue, debouncedCheck]);

    const onSubmit = form.handleSubmit(async (values) => {
        try {
        await completeOnboarding(values);
        } catch (e: any) {
        form.setError("username", { message: e?.message ?? "Something went wrong" });
        }
    });

    return (
        <form onSubmit={onSubmit} className="mt-8 space-y-6 max-w-lg">
        <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <div className="flex items-center gap-2">
            <Input
                placeholder="your-name"
                {...form.register("username")}
                onChange={(e) => {
                const v = e.target.value.replace(/\s+/g, "-");
                form.setValue("username", v, { shouldValidate: true, shouldDirty: true });
                }}
            />
            <span className="text-sm whitespace-nowrap opacity-70">
                {checking ? "Checking..." : isAvailable === null ? "" : isAvailable ? "✓ Available" : "✗ Taken"}
            </span>
            </div>
            {form.formState.errors.username && (
            <p className="text-sm text-red-600">{form.formState.errors.username.message}</p>
            )}
            <p className="text-xs opacity-70">Allowed: letters, numbers, “_” and “-”. 3–24 chars.</p>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Display name</label>
            <Input placeholder="Your public name" {...form.register("display_name")} />
            {form.formState.errors.display_name && (
            <p className="text-sm text-red-600">{form.formState.errors.display_name.message}</p>
            )}
        </div>

        <div className="flex items-start gap-3">
            <input id="accept_terms" type="checkbox" className="mt-1 size-4" {...form.register("accept_terms")} />
            <label htmlFor="accept_terms" className="text-sm">
            I accept the <a href="/(public)/terms-privacy-cookies" className="underline">Terms & Privacy</a>.
            </label>
        </div>
        {form.formState.errors.accept_terms && (
            <p className="text-sm text-red-600">{form.formState.errors.accept_terms.message}</p>
        )}

        <div className="pt-2">
            <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Finish onboarding"}
            </Button>
        </div>
        </form>
    );
}
