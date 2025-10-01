"use client";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <section className="relative mx-auto max-w-6xl px-4 md:px-12 lg:px-16 xl:px-24 py-16 md:py-24">
        <h1 className="font-titles font-extrabold text-[12vw] sm:text-[10vw] md:text-[7vw] lg:text-[6.5vw] leading-[0.8] mb-10 md:mb-12">
          Terms & Privacy
        </h1>

        <div className="prose prose-invert max-w-none prose-headings:font-titles prose-p:font-light prose-li:font-light prose-a:text-blue">
          {/* TERMS */}
          <section className="mb-12">
            <h2 className="font-titles font-bold text-2xl mb-4">1. Terms of Service</h2>
            <p>
              Welcome to <strong>show-off.art</strong>. By accessing or using our
              platform, you agree to comply with these Terms of Service. If you do
              not agree, you may not use the platform.
            </p>
            <h3 className="font-bold py-2">Eligibility</h3>
            <p>
              You must be at least 16 years old to create an account. If you are
              under 18, you may only use the service under the supervision of a
              parent or guardian.
            </p>
            <h3 className="font-bold py-2">User Content</h3>
            <p>
              You retain ownership of the work you upload (images, videos, text,
              designs). By uploading, you grant show-off.art a non-exclusive license
              to display and distribute your work on our platform solely for
              portfolio purposes.
            </p>
            <h3 className="font-bold py-2">Prohibited Conduct</h3>
            <ul>
              <li>Do not upload content you do not own or have rights to share.</li>
              <li>Do not post illegal, offensive, or discriminatory material.</li>
              <li>Do not attempt to hack, scrape, or misuse the platform’s infrastructure.</li>
            </ul>
            <h3 className="font-bold py-2">Termination</h3>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these terms without prior notice.
            </p>
          </section>

          {/* PRIVACY */}
          <section className="mb-12">
            <h2 className="font-titles font-bold text-2xl mb-4">2. Privacy Policy</h2>
            <p>
              Your privacy is important to us. This Privacy Policy explains how we
              collect, use, and protect your data.
            </p>
            <h3 className="font-bold py-2">Data We Collect</h3>
            <ul>
              <li>
                <strong>Account Data:</strong> email, username, display name, password (hashed).
              </li>
              <li>
                <strong>Portfolio Data:</strong> images, videos, descriptions, and metadata you upload.
              </li>
              <li>
                <strong>Usage Data:</strong> logs of interactions with the platform (analytics, error reports).
              </li>
            </ul>
            <h3 className="font-bold py-2">How We Use Data</h3>
            <ul>
              <li>To provide and improve our services.</li>
              <li>To personalize your user experience.</li>
              <li>To communicate with you about updates, security, or support issues.</li>
            </ul>
            <h3 className="font-bold py-2">Data Sharing</h3>
            <p>
              We do not sell your data. We only share information with trusted
              service providers (e.g., hosting, analytics) as necessary to operate the platform.
            </p>
            <h3 className="font-bold py-2">Data Retention</h3>
            <p>
              We retain your data as long as your account is active. You may request
              deletion at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-titles font-bold text-2xl mb-4">3. Contact</h2>
            <p>
              If you have any questions about these Terms, Privacy Policy, or Cookies Policy, please contact us at:
            </p>
            <p>
              <a href="mailto:hello@showoff.dev" className="underline">hello@showoff.dev</a>
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
