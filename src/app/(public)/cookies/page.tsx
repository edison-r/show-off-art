"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

export default function CookiesPage() {
    const [analyticsConsent, setAnalyticsConsent] = useState<null | boolean>(null);
    const [marketingConsent, setMarketingConsent] = useState<null | boolean>(null);
    const [saved, setSaved] = useState(false);
    const liveRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        try {
        const raw = localStorage.getItem("cookie-consent");
        if (raw) {
            const parsed = JSON.parse(raw);
            setAnalyticsConsent(Boolean(parsed.analytics));
            setMarketingConsent(Boolean(parsed.marketing));
        } else {
            setAnalyticsConsent(false);
            setMarketingConsent(false);
        }
        } catch {
        setAnalyticsConsent(false);
        setMarketingConsent(false);
        }
    }, []);

    const saveConsent = () => {
        const payload = {
        analytics: !!analyticsConsent,
        marketing: !!marketingConsent,
        updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("cookie-consent", JSON.stringify(payload));
        setSaved(true);
        // Limpia el aviso tras unos segundos
        setTimeout(() => setSaved(false), 2500);
        // Foco al region live para lectores de pantalla
        liveRef.current?.focus();
    };

    return (
        <main className="min-h-screen bg-white text-black">
        <Header />

        <section className="relative mx-auto max-w-6xl px-4 md:px-12 lg:px-16 xl:px-24 py-16 md:py-24">
            <header className="mb-10 md:mb-12">
            <h1 className="font-titles font-extrabold text-[12vw] sm:text-[10vw] md:text-[7vw] lg:text-[6.5vw] leading-[0.8]">
                Cookie&nbsp;Policy
            </h1>
            <p className="mt-4 text-sm text-black/50">
                Last updated: September 30, 2025
            </p>
            </header>

            <div className="prose prose-invert max-w-none prose-headings:font-titles prose-p:font-light prose-li:font-light prose-a:text-blue">
            <p className="mb-4">
                At <strong>show-off.art</strong> we use cookies and similar technologies to make
                the website work, keep user sessions, and optionally improve the experience
                with usage metrics. This page explains what cookies we use, why we use them,
                and how you can manage them.
            </p>

            <p className="text-sm">
                <strong>What are cookies?</strong> They are small files stored on your device
                when you browse a website. Cookies can be first party (set by our domain) or
                third party (set by integrated services such as analytics or embedded videos).
            </p>

            <h2 className="text-2xl !mb-3 mt-10">{`1) Necessary (functional) cookies`}</h2>
            <p>
                These cookies are essential for the website to function correctly and to keep
                your session when you sign in. They do not require your consent.
            </p>

            <h2 className="text-2xl !mb-3 mt-10">{`2) Optional cookies`}</h2>
            <p>
                Optional cookies are only enabled if you provide consent. This category includes,
                for example, analytics cookies to measure site usage or marketing cookies placed
                by third parties that track behavior.
            </p>

            {/* Tabla responsiva */}
            <div className="not-prose mt-6 overflow-x-auto rounded-2xl border border-blue-gray/30 bg-black/5 backdrop-blur">
                <table className="min-w-[640px] w-full text-sm">
                <thead className="bg-blue-gray/10 text-left">
                    <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3">Consent</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t border-blue-gray/20">
                    <td className="px-4 py-3">Analytics</td>
                    <td className="px-4 py-3">
                        Measure traffic, most viewed pages, and performance without personally
                        identifying you, unless configured otherwise by the provider.
                    </td>
                    <td className="px-4 py-3">Yes</td>
                    </tr>
                    <tr className="border-t border-blue-gray/20">
                    <td className="px-4 py-3">Embedded videos, social widgets</td>
                    <td className="px-4 py-3">
                        Display third party content and/or build advertising profiles.
                    </td>
                    <td className="px-4 py-3">Yes</td>
                    </tr>
                </tbody>
                </table>
            </div>

            {/* Gestor de preferencias */}
            <div className="not-prose mt-8 rounded-2xl border border-blue-gray/30 p-5 md:p-6 space-y-4 bg-black/5 backdrop-blur">
                <h3 className="font-semibold">Manage preferences</h3>


                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-start">
                {/* Toggle simple con Tailwind puro */}
                <label className="flex items-center gap-3">
                    <button
                    type="button"
                    onClick={() => setAnalyticsConsent(!analyticsConsent)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                        ${analyticsConsent ? "bg-blue" : "bg-blue-gray/50"}`}
                    aria-pressed={!!analyticsConsent}
                    aria-label="Allow analytics cookies"
                    >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition
                        ${analyticsConsent ? "translate-x-5" : "translate-x-1"}`}
                    />
                    </button>
                    <span>Allow analytics cookies</span>
                </label>

                <label className="flex items-center gap-3">
                    <button
                    type="button"
                    onClick={() => setMarketingConsent(!marketingConsent)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                        ${marketingConsent ? "bg-blue" : "bg-blue-gray/50"}`}
                    aria-pressed={!!marketingConsent}
                    aria-label="Allow marketing cookies"
                    >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition
                        ${marketingConsent ? "translate-x-5" : "translate-x-1"}`}
                    />
                    </button>
                    <span>Allow marketing cookies</span>
                </label>
                </div>

                <div className="flex gap-3">
                <button
                    onClick={saveConsent}
                    className="rounded-lg border border-blue-gray px-4 py-2 text-sm hover:bg-blue-gray/50 transition"
                >
                    Save preferences
                </button>
                <p
                    ref={liveRef}
                    tabIndex={-1}
                    aria-live="polite"
                    className={`text-sm ${saved ? "opacity-100" : "opacity-0"} transition-opacity`}
                >
                    Preferences saved.
                </p>
                </div>
            </div>

            <h2 className="text-2xl !mt-10 !mb-3">{`3) Managing cookies in your browser`}</h2>
            <p className="text-sm">
                You can block or delete cookies in your browser settings. Please note that if you
                block necessary cookies, some parts of the site may not function properly.
            </p>

            <h2 className="text-2xl !mt-10 !mb-3">{`4) Data controller and contact`}</h2>
            <p className="text-sm">
                <strong>Controller:</strong> show-off.art<br />
                <strong>Contact:</strong> support@show-off.art
            </p>

            <p className="text-xs mt-4">
                For more information about how we process your data, please see our{" "}
                <a href="/terms" className="underline">Terms and Conditions &amp; Privacy Policy</a>.
            </p>
            </div>
        </section>

        <Footer />
        </main>
    );
}
