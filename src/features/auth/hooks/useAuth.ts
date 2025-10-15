"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ========== REGISTRO ==========
    
    async function signUpWithEmail(email: string, password: string) {
        setLoading(true);
        setError(null);
        
        try {
        const redirectTo = `${location.origin}/auth/callback`;
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: redirectTo },
        });
        
        if (error) throw error;
        
        return { success: true };
        } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed";
        setError(message);
        return { success: false, error: message };
        } finally {
        setLoading(false);
        }
    }

    // ========== LOGIN CON PASSWORD ==========
    
    async function signInWithPassword(email: string, password: string) {
        setLoading(true);
        setError(null);
        
        try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) throw error;

        // Verificar si completó onboarding
        const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", data.user.id)
            .maybeSingle();

        return { 
            success: true, 
            hasCompletedOnboarding: !!profile?.username 
        };
        
        } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid email or password";
        setError(message);
        return { success: false, error: message };
        } finally {
        setLoading(false);
        }
    }

    // ========== MAGIC LINK ==========
    
    async function signInWithMagicLink(email: string) {
        setLoading(true);
        setError(null);
        
        try {
        const redirectTo = `${location.origin}/auth/callback`;
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: redirectTo },
        });
        
        if (error) throw error;
        
        return { success: true };
        } catch (err) {
        const message = err instanceof Error ? err.message : "Could not send magic link";
        setError(message);
        return { success: false, error: message };
        } finally {
        setLoading(false);
        }
    }

    // ========== GOOGLE OAUTH ==========
    
    async function signInWithGoogle() {
        setLoading(true);
        setError(null);
        
        try {
        const redirectTo = `${location.origin}/auth/callback`;
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo },
        });
        
        if (error) throw error;
        return { success: true };
        } catch (err) {
        const message = err instanceof Error ? err.message : "Google sign-in failed";
        setError(message);
        return { success: false, error: message };
        } finally {
        setLoading(false);
        }
    }

    return {
        loading,
        error,
        signUpWithEmail,
        signInWithPassword,
        signInWithMagicLink,
        signInWithGoogle,
    };
}