"use client";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

export default function CookiesPage() {
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
