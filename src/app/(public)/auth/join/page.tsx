"use client";

import { useState } from "react";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageWrapper } from "@/components/shared/PageWrapper";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  const { navigateWithTransition } = useNavigationHelper();
  const { loading, error, signUpWithEmail, signInWithGoogle } = useAuth();
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleEmailSignUp(email: string, password: string) {
    const result = await signUpWithEmail(email, password);
    
    if (result.success) {
      setSuccessMessage(
        "We sent you a verification email. Please check your inbox."
      );
    }
  }

  async function handleGoogleSignIn() {
    await signInWithGoogle();
  }

  return (
    <main className="min-h-screen bg-[var(--black)] text-[var(--black-cream)]">
      <Header />
      
      <PageWrapper className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 md:pt-20 md:pb-10">
        <h1 className="relative z-10 font-titles font-extrabold text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[8vw] leading-[0.8] select-none">
          Show your work to the world
        </h1>

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
          <RegisterForm
            onEmailSubmit={handleEmailSignUp}
            onGoogleSubmit={handleGoogleSignIn}
            loading={loading}
            navigateWithTransition={navigateWithTransition}
          />
        </div>
      </PageWrapper>

      <Footer />
    </main>
  );
}