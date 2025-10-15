// src/app/(public)/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageWrapper } from "@/components/shared/PageWrapper";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { navigateWithTransition } = useNavigationHelper();
  const { 
    loading, 
    error, 
    signInWithPassword, 
    signInWithMagicLink, 
    signInWithGoogle 
  } = useAuth();
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handlePasswordLogin(email: string, password: string) {
    const result = await signInWithPassword(email, password);
    
    if (result.success) {
      // Redirigir según si completó onboarding o no
      const destination = result.hasCompletedOnboarding ? "/dashboard" : "/onboarding";
      router.replace(destination);
    }
  }

  async function handleMagicLink(email: string) {
    const result = await signInWithMagicLink(email);
    
    if (result.success) {
      setSuccessMessage("Check your inbox for the magic link");
    }
  }

  async function handleGoogleLogin() {
    await signInWithGoogle();
    // Google OAuth redirige automáticamente
  }

  return (
    <main className="min-h-screen bg-[var(--black)] text-[var(--black-cream)]">
      <Header />
      
      <PageWrapper className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 pb-10 md:pt-20 md:pb-10">
        <h1 className="relative z-10 font-titles font-extrabold text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[8vw] leading-[0.8] select-none">
          Welcome back
        </h1>

        {/* Mensajes de error/éxito */}
        {error && (
          <div className="-mb-10 mt-4 rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm max-w-xl">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="-mb-10 mt-4 rounded-lg border border-green-300 bg-green-50 text-green-700 px-4 py-3 text-sm max-w-xl">
            {successMessage}
          </div>
        )}

        <div className="mt-16">
          <LoginForm
            onPasswordSubmit={handlePasswordLogin}
            onMagicLinkSubmit={handleMagicLink}
            onGoogleSubmit={handleGoogleLogin}
            loading={loading}
            navigateWithTransition={navigateWithTransition}
          />
        </div>
      </PageWrapper>

      <Footer />
    </main>
  );
}