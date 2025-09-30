"use client";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 prose prose-blue">
      <h1 className="relative z-10 font-titles font-extrabold text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[8vw] leading-[0.75] select-none mt-6 sm:mt-8 md:mt-10 mb-24">Terms & Privacy</h1>

      <section className="mb-12">
        <h2>1. Terms of Service</h2>
        <p>
          Welcome to <strong>show-off.art</strong>. By accessing or using our
          platform, you agree to comply with these Terms of Service. If you do
          not agree, you may not use the platform.
        </p>
        <h3>Eligibility</h3>
        <p>
          You must be at least 16 years old to create an account. If you are
          under 18, you may only use the service under the supervision of a
          parent or guardian.
        </p>
        <h3>User Content</h3>
        <p>
          You retain ownership of the work you upload (images, videos, text,
          designs). By uploading, you grant show-off.art a non-exclusive license
          to display and distribute your work on our platform solely for
          portfolio purposes.
        </p>
        <h3>Prohibited Conduct</h3>
        <ul>
          <li>Do not upload content you do not own or have rights to share.</li>
          <li>Do not post illegal, offensive, or discriminatory material.</li>
          <li>
            Do not attempt to hack, scrape, or misuse the platform’s
            infrastructure.
          </li>
        </ul>
        <h3>Termination</h3>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these terms without prior notice.
        </p>
      </section>

      {/* PRIVACY POLICY */}
      <section className="mb-12">
        <h2>2. Privacy Policy</h2>
        <p>
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, and protect your data.
        </p>
        <h3>Data We Collect</h3>
        <ul>
          <li>
            <strong>Account Data:</strong> email, username, display name,
            password (hashed).
          </li>
          <li>
            <strong>Portfolio Data:</strong> images, videos, descriptions, and
            metadata you upload.
          </li>
          <li>
            <strong>Usage Data:</strong> logs of interactions with the platform
            (analytics, error reports).
          </li>
        </ul>
        <h3>How We Use Data</h3>
        <ul>
          <li>To provide and improve our services.</li>
          <li>To personalize your user experience.</li>
          <li>
            To communicate with you about updates, security, or support issues.
          </li>
        </ul>
        <h3>Data Sharing</h3>
        <p>
          We do not sell your data. We only share information with trusted
          service providers (e.g., hosting, analytics) as necessary to operate
          the platform.
        </p>
        <h3>Data Retention</h3>
        <p>
          We retain your data as long as your account is active. You may request
          deletion at any time by contacting us.
        </p>
      </section>

      {/* COOKIES POLICY */}
      <section className="mb-12">
        <h2>3. Cookies Policy</h2>
        <p>
          We use cookies and similar technologies to provide essential features,
          analyze traffic, and improve the platform.
        </p>
        <h3>Types of Cookies</h3>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> required for login and account
            functionality.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> help us understand usage
            patterns (e.g., via Google Analytics).
          </li>
          <li>
            <strong>Preference Cookies:</strong> remember your settings such as
            language or theme.
          </li>
        </ul>
        <h3>Managing Cookies</h3>
        <p>
          You can disable cookies in your browser, but some features may not
          function properly.
        </p>
      </section>

      {/* CONTACT */}
      <section>
        <h2>4. Contact</h2>
        <p>
          If you have any questions about these Terms, Privacy Policy, or
          Cookies Policy, please contact us at:
        </p>
        <p>
          <a href="mailto:hello@showoff.dev">hello@showoff.dev</a>
        </p>
      </section>
    </main>
  );
}
